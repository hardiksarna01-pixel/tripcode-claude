/**
 * Markup Configuration
 * Defines markup types and validation rules
 */

const MARKUP_TYPES = {
    FIXED: 'fixed',
    PERCENTAGE: 'percentage'
};

const MARKUP_APPLY_TO = {
    ALL: 'all',
    AIRLINE: 'airline',
    ROUTE: 'route',
    CLASS: 'class'
};

const DEFAULT_MARKUP = {
    type: MARKUP_TYPES.FIXED,
    amount: 0,
    applyTo: MARKUP_APPLY_TO.ALL,
    isActive: true
};

/**
 * Calculate markup amount based on configuration
 */
function calculateMarkup(baseFare, markup) {
    if (!markup || !markup.isActive) return 0;

    if (markup.type === MARKUP_TYPES.PERCENTAGE) {
        return Math.round((baseFare * markup.amount) / 100);
    }
    return markup.amount;
}

/**
 * Apply markup to flight fare
 */
function applyMarkupToFare(flight, markups, passengerCount = 1) {
    let totalMarkup = 0;

    for (const markup of markups) {
        if (!markup.isActive) continue;

        let shouldApply = false;

        switch (markup.applyTo) {
            case MARKUP_APPLY_TO.ALL:
                shouldApply = true;
                break;
            case MARKUP_APPLY_TO.AIRLINE:
                shouldApply = flight.airlineCode === markup.airlineCode;
                break;
            case MARKUP_APPLY_TO.ROUTE:
                shouldApply =
                    flight.origin === markup.origin &&
                    flight.destination === markup.destination;
                break;
            case MARKUP_APPLY_TO.CLASS:
                shouldApply = flight.cabinClass === markup.cabinClass;
                break;
            default:
                shouldApply = false;
        }

        if (shouldApply) {
            const markupAmount = calculateMarkup(flight.baseFare, markup);
            totalMarkup += markup.perPassenger ? markupAmount * passengerCount : markupAmount;
        }
    }

    return totalMarkup;
}

/**
 * Validate markup configuration
 */
function validateMarkup(markup) {
    const errors = [];

    if (!markup.type || !Object.values(MARKUP_TYPES).includes(markup.type)) {
        errors.push('Invalid markup type');
    }

    if (typeof markup.amount !== 'number' || markup.amount < 0) {
        errors.push('Markup amount must be a non-negative number');
    }

    if (markup.type === MARKUP_TYPES.PERCENTAGE && markup.amount > 100) {
        errors.push('Percentage markup cannot exceed 100%');
    }

    if (!markup.applyTo || !Object.values(MARKUP_APPLY_TO).includes(markup.applyTo)) {
        errors.push('Invalid applyTo value');
    }

    if (markup.applyTo === MARKUP_APPLY_TO.ROUTE && (!markup.origin || !markup.destination)) {
        errors.push('Route markup requires origin and destination');
    }

    if (markup.applyTo === MARKUP_APPLY_TO.AIRLINE && !markup.airlineCode) {
        errors.push('Airline markup requires airlineCode');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    MARKUP_TYPES,
    MARKUP_APPLY_TO,
    DEFAULT_MARKUP,
    calculateMarkup,
    applyMarkupToFare,
    validateMarkup
};
