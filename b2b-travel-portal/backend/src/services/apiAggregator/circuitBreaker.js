/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures when a supplier API is down
 */

class CircuitBreaker {
    static breakers = new Map();

    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.successThreshold = options.successThreshold || 3;
        this.timeout = options.timeout || 30000; // 30 seconds
        this.halfOpenTimeout = options.halfOpenTimeout || 60000; // 1 minute

        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = null;
        this.nextAttemptTime = null;
    }

    /**
     * Get or create breaker for a supplier
     */
    static getBreaker(supplierId, options = {}) {
        if (!CircuitBreaker.breakers.has(supplierId)) {
            CircuitBreaker.breakers.set(supplierId, new CircuitBreaker(options));
        }
        return CircuitBreaker.breakers.get(supplierId);
    }

    /**
     * Check if circuit is open
     */
    isOpen() {
        if (this.state === 'OPEN') {
            // Check if we should transition to half-open
            if (Date.now() >= this.nextAttemptTime) {
                this.state = 'HALF_OPEN';
                console.log(`[CircuitBreaker] Transitioning to HALF_OPEN`);
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * Check if circuit allows request
     */
    canRequest() {
        return this.state !== 'OPEN' || Date.now() >= this.nextAttemptTime;
    }

    /**
     * Record a successful call
     */
    recordSuccess() {
        this.failureCount = 0;

        if (this.state === 'HALF_OPEN') {
            this.successCount++;
            if (this.successCount >= this.successThreshold) {
                this.state = 'CLOSED';
                this.successCount = 0;
                console.log(`[CircuitBreaker] Circuit CLOSED - service recovered`);
            }
        }
    }

    /**
     * Record a failed call
     */
    recordFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        this.successCount = 0;

        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttemptTime = Date.now() + this.halfOpenTimeout;
            console.log(`[CircuitBreaker] Circuit OPEN - too many failures`);
        }
    }

    /**
     * Get current state
     */
    getState() {
        if (this.state === 'OPEN' && Date.now() >= this.nextAttemptTime) {
            return 'HALF_OPEN';
        }
        return this.state;
    }

    /**
     * Get stats
     */
    getStats() {
        return {
            state: this.getState(),
            failureCount: this.failureCount,
            successCount: this.successCount,
            lastFailureTime: this.lastFailureTime,
            nextAttemptTime: this.nextAttemptTime
        };
    }

    /**
     * Reset the circuit breaker
     */
    reset() {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = null;
        this.nextAttemptTime = null;
    }

    /**
     * Force open the circuit
     */
    forceOpen() {
        this.state = 'OPEN';
        this.nextAttemptTime = Date.now() + this.halfOpenTimeout;
    }

    /**
     * Get all breaker states
     */
    static getAllStates() {
        const states = {};
        for (const [id, breaker] of CircuitBreaker.breakers) {
            states[id] = breaker.getStats();
        }
        return states;
    }

    /**
     * Reset all breakers
     */
    static resetAll() {
        for (const breaker of CircuitBreaker.breakers.values()) {
            breaker.reset();
        }
    }
}

module.exports = CircuitBreaker;
