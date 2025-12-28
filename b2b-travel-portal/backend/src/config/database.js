/**
 * In-Memory Database Mock
 * Replaces PostgreSQL with in-memory storage for development without database
 */

const bcrypt = require('bcryptjs');

class InMemoryDatabase {
    constructor() {
        this.tables = new Map();
        this.connected = false;
    }

    /**
     * Initialize database connection (mock)
     */
    async connect() {
        if (this.connected) {
            return this;
        }

        // Initialize default tables
        this.tables.set('admins', new Map());
        this.tables.set('agents', new Map());
        this.tables.set('bookings', new Map());
        this.tables.set('transactions', new Map());
        this.tables.set('airlines', new Map());
        this.tables.set('airports', new Map());
        this.tables.set('schemes', new Map());

        // Seed all demo data
        await this.seedAllDemoData();

        this.connected = true;
        console.log('✅ In-memory database initialized successfully');
        return this;
    }

    /**
     * Seed all demo data
     */
    async seedAllDemoData() {
        await this.seedUsers();
        this.seedAirlines();
        this.seedAirports();
        this.seedSchemes();
        this.seedBookings();
        this.seedTransactions();
        this.seedCustomers();
        this.seedHotels();
        console.log('✅ Demo data seeded successfully');
    }

    /**
     * Seed users (admins and agents)
     */
    async seedUsers() {
        const adminPasswordHash = await bcrypt.hash('admin123', 10);
        const agentPasswordHash = await bcrypt.hash('agent123', 10);

        // Seed admin users
        const admins = this.getTable('admins');
        admins.set('admin@flyshop.com', {
            id: '1',
            email: 'admin@flyshop.com',
            password: adminPasswordHash,
            username: 'superadmin',
            fullName: 'Super Admin',
            role: 'SUPER_ADMIN',
            permissions: ['*'],
            isActive: true,
            createdAt: new Date()
        });

        // Seed multiple agents
        const agents = this.getTable('agents');
        const agentData = [
            { id: '1001', email: 'agent@flyshop.com', companyName: 'Demo Travel Agency', contactPerson: 'Demo Agent', mobile: '9876543210', walletBalance: 50000, creditLimit: 100000, city: 'Mumbai', status: 'APPROVED' },
            { id: '1002', email: 'travels@example.com', companyName: 'Sky High Travels', contactPerson: 'Raj Kumar', mobile: '9876543211', walletBalance: 75000, creditLimit: 150000, city: 'Delhi', status: 'APPROVED' },
            { id: '1003', email: 'holidays@example.com', companyName: 'Happy Holidays', contactPerson: 'Priya Sharma', mobile: '9876543212', walletBalance: 25000, creditLimit: 50000, city: 'Bangalore', status: 'APPROVED' },
            { id: '1004', email: 'tours@example.com', companyName: 'World Tours', contactPerson: 'Amit Patel', mobile: '9876543213', walletBalance: 100000, creditLimit: 200000, city: 'Chennai', status: 'APPROVED' },
            { id: '1005', email: 'pending@example.com', companyName: 'New Agency', contactPerson: 'New User', mobile: '9876543214', walletBalance: 0, creditLimit: 0, city: 'Pune', status: 'PENDING' },
        ];

        for (const agent of agentData) {
            agents.set(agent.email, {
                ...agent,
                password: agentPasswordHash,
                role: 'AGENT',
                apiUserId: `API_${agent.id}`,
                apiPasswordHash: 'API_HASH',
                isActive: true,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
        }

        console.log('✅ Seeded users:');
        console.log('   Admin: admin@flyshop.com / admin123');
        console.log('   Agent: agent@flyshop.com / agent123');
    }

    /**
     * Seed airlines
     */
    seedAirlines() {
        const airlines = this.getTable('airlines');
        const airlineData = [
            { code: '6E', name: 'IndiGo', logo: '/airlines/6e.png', country: 'India' },
            { code: 'AI', name: 'Air India', logo: '/airlines/ai.png', country: 'India' },
            { code: 'SG', name: 'SpiceJet', logo: '/airlines/sg.png', country: 'India' },
            { code: 'UK', name: 'Vistara', logo: '/airlines/uk.png', country: 'India' },
            { code: 'G8', name: 'Go First', logo: '/airlines/g8.png', country: 'India' },
            { code: 'I5', name: 'AirAsia India', logo: '/airlines/i5.png', country: 'India' },
            { code: 'QP', name: 'Akasa Air', logo: '/airlines/qp.png', country: 'India' },
            { code: 'EK', name: 'Emirates', logo: '/airlines/ek.png', country: 'UAE' },
            { code: 'SQ', name: 'Singapore Airlines', logo: '/airlines/sq.png', country: 'Singapore' },
            { code: 'TG', name: 'Thai Airways', logo: '/airlines/tg.png', country: 'Thailand' },
        ];
        airlineData.forEach(a => airlines.set(a.code, a));
    }

    /**
     * Seed airports
     */
    seedAirports() {
        const airports = this.getTable('airports');
        const airportData = [
            { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
            { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
            { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
            { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
            { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
            { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
            { code: 'GOI', name: 'Goa International Airport', city: 'Goa', country: 'India' },
            { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India' },
            { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
            { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India' },
            { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
            { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
            { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
            { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
            { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
        ];
        airportData.forEach(a => airports.set(a.code, a));
    }

    /**
     * Seed schemes
     */
    seedSchemes() {
        const schemes = this.getTable('schemes');
        const schemeData = [
            { id: '1', name: 'Standard', code: 'STD', domesticCommission: 2.5, intlCommission: 3.0, serviceFee: 150, isDefault: true },
            { id: '2', name: 'Premium', code: 'PRM', domesticCommission: 3.5, intlCommission: 4.0, serviceFee: 100, isDefault: false },
            { id: '3', name: 'Enterprise', code: 'ENT', domesticCommission: 4.0, intlCommission: 5.0, serviceFee: 0, isDefault: false },
        ];
        schemeData.forEach(s => schemes.set(s.id, { ...s, isActive: true, createdAt: new Date() }));
    }

    /**
     * Seed sample bookings
     */
    seedBookings() {
        const bookings = this.getTable('bookings');
        const routes = ['DEL-BOM', 'BOM-BLR', 'DEL-GOI', 'BLR-DEL', 'MAA-DEL', 'HYD-BOM'];
        const statuses = ['CONFIRMED', 'CONFIRMED', 'CONFIRMED', 'PENDING', 'CANCELLED'];
        const airlines = ['6E', 'AI', 'SG', 'UK', 'G8'];

        for (let i = 1; i <= 25; i++) {
            const route = routes[Math.floor(Math.random() * routes.length)];
            const [origin, destination] = route.split('-');
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const amount = 3000 + Math.floor(Math.random() * 7000);
            const daysAgo = Math.floor(Math.random() * 30);
            const travelDaysFromNow = Math.floor(Math.random() * 60);

            bookings.set(`BK${1000 + i}`, {
                id: `BK${1000 + i}`,
                pnr: `PNR${100000 + i}`,
                agentId: '1001',
                agentEmail: 'agent@flyshop.com',
                route: route,
                origin,
                destination,
                airline,
                flightNumber: `${airline}${100 + i}`,
                travelDate: new Date(Date.now() + travelDaysFromNow * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                departureTime: `${8 + Math.floor(Math.random() * 12)}:${Math.random() > 0.5 ? '00' : '30'}`,
                passengers: [
                    { name: `Passenger ${i}`, type: 'ADULT', gender: 'M' }
                ],
                totalAmount: amount,
                baseAmount: amount * 0.85,
                taxes: amount * 0.15,
                commission: amount * 0.025,
                status,
                paymentStatus: status === 'CONFIRMED' ? 'PAID' : 'PENDING',
                createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
                updatedAt: new Date()
            });
        }
    }

    /**
     * Seed transactions
     */
    seedTransactions() {
        const transactions = this.getTable('transactions');
        const types = ['CREDIT', 'DEBIT', 'COMMISSION', 'REFUND'];

        for (let i = 1; i <= 30; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const amount = 1000 + Math.floor(Math.random() * 9000);
            const daysAgo = Math.floor(Math.random() * 30);

            transactions.set(`TXN${1000 + i}`, {
                id: `TXN${1000 + i}`,
                agentId: '1001',
                type,
                amount,
                balance: 50000 + (type === 'CREDIT' ? amount : -amount),
                description: type === 'DEBIT' ? 'Booking payment' : type === 'CREDIT' ? 'Wallet recharge' : type === 'COMMISSION' ? 'Booking commission' : 'Cancellation refund',
                reference: `REF${100000 + i}`,
                createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
            });
        }
    }

    /**
     * Seed customers
     */
    seedCustomers() {
        const customers = this.getTable('customers');
        const customerData = [
            { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543001', dob: '1990-05-15', gender: 'M' },
            { id: '2', name: 'Priya Patel', email: 'priya@example.com', phone: '9876543002', dob: '1988-08-22', gender: 'F' },
            { id: '3', name: 'Amit Kumar', email: 'amit@example.com', phone: '9876543003', dob: '1985-12-10', gender: 'M' },
            { id: '4', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '9876543004', dob: '1992-03-28', gender: 'F' },
            { id: '5', name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543005', dob: '1987-07-05', gender: 'M' },
        ];
        customerData.forEach(c => customers.set(c.id, { ...c, agentId: '1001', createdAt: new Date() }));
    }

    /**
     * Seed hotels
     */
    seedHotels() {
        const hotels = this.getTable('hotels');
        const hotelData = [
            { id: '1', name: 'Taj Mahal Palace', city: 'Mumbai', rating: 5, pricePerNight: 15000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'] },
            { id: '2', name: 'The Oberoi', city: 'New Delhi', rating: 5, pricePerNight: 12000, amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'] },
            { id: '3', name: 'ITC Grand Chola', city: 'Chennai', rating: 5, pricePerNight: 10000, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'] },
            { id: '4', name: 'Leela Palace', city: 'Bangalore', rating: 5, pricePerNight: 11000, amenities: ['WiFi', 'Pool', 'Gym', 'Spa'] },
            { id: '5', name: 'Marriott', city: 'Hyderabad', rating: 4, pricePerNight: 7000, amenities: ['WiFi', 'Pool', 'Gym'] },
            { id: '6', name: 'Novotel', city: 'Goa', rating: 4, pricePerNight: 6000, amenities: ['WiFi', 'Pool', 'Beach Access'] },
            { id: '7', name: 'Radisson Blu', city: 'Pune', rating: 4, pricePerNight: 5500, amenities: ['WiFi', 'Pool', 'Restaurant'] },
            { id: '8', name: 'Holiday Inn', city: 'Kochi', rating: 3, pricePerNight: 4000, amenities: ['WiFi', 'Restaurant'] },
        ];
        hotelData.forEach(h => hotels.set(h.id, { ...h, available: true, createdAt: new Date() }));
    }

    /**
     * Execute a query (mock implementation)
     * Returns empty results for SELECT, affected count for INSERT/UPDATE/DELETE
     */
    async query(text, params = []) {
        const start = Date.now();
        const duration = Date.now() - start;

        if (process.env.LOG_LEVEL === 'debug') {
            console.log('Query executed (mock):', { text: text.substring(0, 100), duration, rows: 0 });
        }

        // Return mock result structure
        return {
            rows: [],
            rowCount: 0,
            command: text.split(' ')[0].toUpperCase(),
            fields: []
        };
    }

    /**
     * Get a client from the pool for transactions (mock)
     */
    async getClient() {
        const self = this;
        return {
            query: async (text, params) => self.query(text, params),
            release: () => {},
        };
    }

    /**
     * Execute a transaction (mock)
     */
    async transaction(callback) {
        const client = await this.getClient();
        try {
            // No actual BEGIN needed for in-memory
            const result = await callback(client);
            // No actual COMMIT needed
            return result;
        } catch (error) {
            // No actual ROLLBACK needed
            throw error;
        }
    }

    /**
     * Close the pool (mock)
     */
    async close() {
        this.tables.clear();
        this.connected = false;
        console.log('In-memory database closed');
    }

    /**
     * Helper: Get a table
     */
    getTable(tableName) {
        if (!this.tables.has(tableName)) {
            this.tables.set(tableName, new Map());
        }
        return this.tables.get(tableName);
    }

    /**
     * Helper: Insert into table
     */
    insert(tableName, id, data) {
        const table = this.getTable(tableName);
        table.set(id, { ...data, id });
        return { id, ...data };
    }

    /**
     * Helper: Find by ID
     */
    findById(tableName, id) {
        const table = this.getTable(tableName);
        return table.get(id) || null;
    }

    /**
     * Helper: Find all
     */
    findAll(tableName) {
        const table = this.getTable(tableName);
        return Array.from(table.values());
    }

    /**
     * Helper: Update
     */
    update(tableName, id, data) {
        const table = this.getTable(tableName);
        const existing = table.get(id);
        if (existing) {
            const updated = { ...existing, ...data };
            table.set(id, updated);
            return updated;
        }
        return null;
    }

    /**
     * Helper: Delete
     */
    delete(tableName, id) {
        const table = this.getTable(tableName);
        return table.delete(id);
    }
}

module.exports = new InMemoryDatabase();
