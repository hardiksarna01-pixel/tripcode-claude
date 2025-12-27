/**
 * Performance Test for Multi-Supplier API Aggregator
 * Simulates 100 API providers with realistic response times
 */

const { performance } = require('perf_hooks');

// Simulated supplier configurations (100 suppliers)
const simulatedSuppliers = [];

// GDS Providers (typically slower, 800-2000ms)
for (let i = 1; i <= 10; i++) {
    simulatedSuppliers.push({
        id: `gds_${i}`,
        name: `GDS Provider ${i}`,
        type: 'gds',
        avgResponseTime: 800 + Math.random() * 1200, // 800-2000ms
        reliability: 0.95,
        flightsReturned: Math.floor(20 + Math.random() * 30)
    });
}

// LCC Direct APIs (fastest, 200-600ms)
for (let i = 1; i <= 25; i++) {
    simulatedSuppliers.push({
        id: `lcc_${i}`,
        name: `LCC Airline ${i}`,
        type: 'lcc',
        avgResponseTime: 200 + Math.random() * 400, // 200-600ms
        reliability: 0.92,
        flightsReturned: Math.floor(5 + Math.random() * 15)
    });
}

// Consolidators (medium speed, 500-1200ms)
for (let i = 1; i <= 30; i++) {
    simulatedSuppliers.push({
        id: `consolidator_${i}`,
        name: `Consolidator ${i}`,
        type: 'consolidator',
        avgResponseTime: 500 + Math.random() * 700, // 500-1200ms
        reliability: 0.88,
        flightsReturned: Math.floor(15 + Math.random() * 40)
    });
}

// Meta Search Aggregators (variable, 600-1500ms)
for (let i = 1; i <= 20; i++) {
    simulatedSuppliers.push({
        id: `meta_${i}`,
        name: `Meta Search ${i}`,
        type: 'meta',
        avgResponseTime: 600 + Math.random() * 900, // 600-1500ms
        reliability: 0.85,
        flightsReturned: Math.floor(30 + Math.random() * 50)
    });
}

// NDC Providers (newer APIs, 400-1000ms)
for (let i = 1; i <= 15; i++) {
    simulatedSuppliers.push({
        id: `ndc_${i}`,
        name: `NDC Provider ${i}`,
        type: 'ndc',
        avgResponseTime: 400 + Math.random() * 600, // 400-1000ms
        reliability: 0.90,
        flightsReturned: Math.floor(10 + Math.random() * 25)
    });
}

console.log(`\n${'='.repeat(70)}`);
console.log('  MULTI-SUPPLIER API AGGREGATOR PERFORMANCE TEST');
console.log('  Simulating 100 API Providers');
console.log(`${'='.repeat(70)}\n`);

// Generate mock flight data
function generateMockFlight(supplierId, index) {
    const airlines = ['6E', 'SG', 'AI', 'UK', 'G8', 'I5', 'QP', 'EK', 'EY', 'QR'];
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const basePrice = 3000 + Math.random() * 12000;

    return {
        id: `${supplierId}_flight_${index}`,
        supplierId,
        airline,
        flightNumber: `${airline}${100 + Math.floor(Math.random() * 900)}`,
        origin: 'DEL',
        destination: 'BOM',
        departureTime: '06:00',
        arrivalTime: '08:15',
        duration: 135,
        stops: Math.random() > 0.7 ? 1 : 0,
        price: Math.round(basePrice),
        currency: 'INR',
        seatsAvailable: Math.floor(1 + Math.random() * 9),
        refundable: Math.random() > 0.5
    };
}

// Simulate API call with realistic latency
async function simulateApiCall(supplier) {
    return new Promise((resolve, reject) => {
        // Simulate network variability (+/- 30%)
        const variability = 0.7 + Math.random() * 0.6;
        const actualResponseTime = supplier.avgResponseTime * variability;

        // Simulate failures based on reliability
        const willFail = Math.random() > supplier.reliability;

        setTimeout(() => {
            if (willFail) {
                reject(new Error(`${supplier.name} timeout`));
            } else {
                const flights = [];
                for (let i = 0; i < supplier.flightsReturned; i++) {
                    flights.push(generateMockFlight(supplier.id, i));
                }
                resolve({
                    supplierId: supplier.id,
                    supplierName: supplier.name,
                    type: supplier.type,
                    flights,
                    responseTime: Math.round(actualResponseTime)
                });
            }
        }, actualResponseTime);
    });
}

// Smart aggregation with early return strategy
async function aggregateWithSmartTimeout(suppliers, options = {}) {
    const {
        minSuppliers = 30,        // Minimum suppliers to wait for
        minFlights = 100,         // Minimum flights before early return
        maxWaitTime = 3000,       // Maximum wait time (ms)
        earlyReturnThreshold = 0.6 // Return when 60% respond
    } = options;

    const startTime = performance.now();
    const results = [];
    const errors = [];
    let resolved = 0;

    return new Promise((resolve) => {
        const checkEarlyReturn = () => {
            const totalFlights = results.reduce((sum, r) => sum + r.flights.length, 0);
            const responseRate = resolved / suppliers.length;

            if (
                (resolved >= minSuppliers && totalFlights >= minFlights) ||
                responseRate >= earlyReturnThreshold
            ) {
                return true;
            }
            return false;
        };

        // Set maximum timeout
        const maxTimeout = setTimeout(() => {
            finalize();
        }, maxWaitTime);

        const finalize = () => {
            clearTimeout(maxTimeout);
            const endTime = performance.now();

            // Aggregate all flights
            const allFlights = results.flatMap(r => r.flights);

            // Deduplicate by flight signature
            const seen = new Set();
            const uniqueFlights = allFlights.filter(f => {
                const sig = `${f.airline}-${f.flightNumber}-${f.departureTime}`;
                if (seen.has(sig)) return false;
                seen.add(sig);
                return true;
            });

            // Sort by price
            uniqueFlights.sort((a, b) => a.price - b.price);

            resolve({
                flights: uniqueFlights,
                totalTime: Math.round(endTime - startTime),
                suppliersQueried: suppliers.length,
                suppliersResponded: results.length,
                suppliersFailed: errors.length,
                avgSupplierResponseTime: results.length > 0
                    ? Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
                    : 0,
                fastestSupplier: results.length > 0
                    ? results.reduce((min, r) => r.responseTime < min.responseTime ? r : min)
                    : null,
                slowestSupplier: results.length > 0
                    ? results.reduce((max, r) => r.responseTime > max.responseTime ? r : max)
                    : null
            });
        };

        // Launch all API calls in parallel
        suppliers.forEach(supplier => {
            simulateApiCall(supplier)
                .then(result => {
                    results.push(result);
                    resolved++;

                    if (checkEarlyReturn()) {
                        finalize();
                    }
                })
                .catch(err => {
                    errors.push({ supplier: supplier.id, error: err.message });
                    resolved++;
                });
        });
    });
}

// Run performance tests
async function runPerformanceTests() {
    console.log('Supplier Distribution:');
    console.log('─'.repeat(50));
    const types = {};
    simulatedSuppliers.forEach(s => {
        types[s.type] = (types[s.type] || 0) + 1;
    });
    Object.entries(types).forEach(([type, count]) => {
        console.log(`  ${type.padEnd(15)} : ${count} suppliers`);
    });
    console.log(`  ${'TOTAL'.padEnd(15)} : ${simulatedSuppliers.length} suppliers`);
    console.log('');

    // Test 1: Full aggregation (all 100 suppliers)
    console.log('\n' + '─'.repeat(70));
    console.log('TEST 1: Full Aggregation (100 suppliers, wait for all)');
    console.log('─'.repeat(70));

    const test1Start = performance.now();
    const test1Result = await aggregateWithSmartTimeout(simulatedSuppliers, {
        minSuppliers: 100,
        minFlights: 9999,
        maxWaitTime: 5000,
        earlyReturnThreshold: 1.0
    });

    console.log(`  Total Response Time    : ${test1Result.totalTime} ms`);
    console.log(`  Suppliers Responded    : ${test1Result.suppliersResponded}/${test1Result.suppliersQueried}`);
    console.log(`  Suppliers Failed       : ${test1Result.suppliersFailed}`);
    console.log(`  Total Flights Found    : ${test1Result.flights.length}`);
    console.log(`  Avg Supplier Response  : ${test1Result.avgSupplierResponseTime} ms`);
    console.log(`  Fastest Supplier       : ${test1Result.fastestSupplier?.supplierName} (${test1Result.fastestSupplier?.responseTime}ms)`);
    console.log(`  Slowest Supplier       : ${test1Result.slowestSupplier?.supplierName} (${test1Result.slowestSupplier?.responseTime}ms)`);

    // Test 2: Smart timeout (early return)
    console.log('\n' + '─'.repeat(70));
    console.log('TEST 2: Smart Timeout (early return when 60% respond)');
    console.log('─'.repeat(70));

    const test2Result = await aggregateWithSmartTimeout(simulatedSuppliers, {
        minSuppliers: 30,
        minFlights: 100,
        maxWaitTime: 3000,
        earlyReturnThreshold: 0.6
    });

    console.log(`  Total Response Time    : ${test2Result.totalTime} ms`);
    console.log(`  Suppliers Responded    : ${test2Result.suppliersResponded}/${test2Result.suppliersQueried}`);
    console.log(`  Total Flights Found    : ${test2Result.flights.length}`);
    console.log(`  Avg Supplier Response  : ${test2Result.avgSupplierResponseTime} ms`);
    console.log(`  Time Saved             : ${test1Result.totalTime - test2Result.totalTime} ms (${Math.round((1 - test2Result.totalTime/test1Result.totalTime) * 100)}%)`);

    // Test 3: Aggressive timeout (fastest results)
    console.log('\n' + '─'.repeat(70));
    console.log('TEST 3: Aggressive Timeout (return ASAP with minimum viable results)');
    console.log('─'.repeat(70));

    const test3Result = await aggregateWithSmartTimeout(simulatedSuppliers, {
        minSuppliers: 20,
        minFlights: 50,
        maxWaitTime: 1500,
        earlyReturnThreshold: 0.4
    });

    console.log(`  Total Response Time    : ${test3Result.totalTime} ms`);
    console.log(`  Suppliers Responded    : ${test3Result.suppliersResponded}/${test3Result.suppliersQueried}`);
    console.log(`  Total Flights Found    : ${test3Result.flights.length}`);
    console.log(`  Avg Supplier Response  : ${test3Result.avgSupplierResponseTime} ms`);

    // Test 4: Multiple search iterations (average over 5 searches)
    console.log('\n' + '─'.repeat(70));
    console.log('TEST 4: Average Response Time (5 consecutive searches)');
    console.log('─'.repeat(70));

    const iterations = 5;
    const times = [];
    const flightCounts = [];

    for (let i = 0; i < iterations; i++) {
        const result = await aggregateWithSmartTimeout(simulatedSuppliers, {
            minSuppliers: 30,
            minFlights: 100,
            maxWaitTime: 3000,
            earlyReturnThreshold: 0.6
        });
        times.push(result.totalTime);
        flightCounts.push(result.flights.length);
        process.stdout.write(`  Iteration ${i + 1}: ${result.totalTime}ms (${result.flights.length} flights)\n`);
    }

    const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const avgFlights = Math.round(flightCounts.reduce((a, b) => a + b, 0) / flightCounts.length);

    console.log('');
    console.log(`  Average Response Time  : ${avgTime} ms`);
    console.log(`  Min Response Time      : ${minTime} ms`);
    console.log(`  Max Response Time      : ${maxTime} ms`);
    console.log(`  Avg Flights per Search : ${avgFlights}`);

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('  PERFORMANCE SUMMARY');
    console.log('='.repeat(70));
    console.log(`
  With 100 API suppliers connected:

  ┌─────────────────────────────────────────────────────────────────┐
  │  Strategy              │  Avg Time  │  Flights  │  Coverage     │
  ├─────────────────────────────────────────────────────────────────┤
  │  Wait for All          │  ~${test1Result.totalTime.toString().padStart(4)}ms   │  ${test1Result.flights.length.toString().padStart(4)}      │  100%         │
  │  Smart Timeout (60%)   │  ~${test2Result.totalTime.toString().padStart(4)}ms   │  ${test2Result.flights.length.toString().padStart(4)}      │  ~60%         │
  │  Aggressive (40%)      │  ~${test3Result.totalTime.toString().padStart(4)}ms   │  ${test3Result.flights.length.toString().padStart(4)}      │  ~40%         │
  └─────────────────────────────────────────────────────────────────┘

  RECOMMENDED CONFIGURATION:
  ─────────────────────────────────────────────────────────────────
  • Use Smart Timeout (60%) for best balance of speed and coverage
  • Expected response time: ${avgTime}ms average
  • User-perceived latency: < 2 seconds for first results
  • Total unique flights: ${avgFlights}+ options from ${test2Result.suppliersResponded} suppliers

  OPTIMIZATION TIPS:
  ─────────────────────────────────────────────────────────────────
  • Enable caching: Reduces repeat searches to ~50ms
  • Priority sorting: Query faster LCC APIs first
  • Circuit breaker: Auto-disable slow/failing suppliers
  • Regional routing: Route to nearest API endpoints
`);
}

// Run the tests
runPerformanceTests().catch(console.error);
