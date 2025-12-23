/**
 * Agent Preferences Configuration
 * Default settings for agent display and search preferences
 */

// Trip Type Options
const TRIP_TYPES = {
    ONE_WAY: { code: 0, name: 'One Way', description: 'Single direction flight' },
    ROUND_TRIP: { code: 1, name: 'Round Trip', description: 'Return flight included' },
    MULTI_CITY: { code: 2, name: 'Multi City', description: 'Multiple destinations' }
};

// Fare Display Options
const FARE_DISPLAY_MODES = {
    TOTAL: {
        code: 'TOTAL',
        name: 'Total Fare',
        description: 'Show total fare for all passengers'
    },
    PER_PERSON: {
        code: 'PER_PERSON',
        name: 'Per Person',
        description: 'Show fare per passenger'
    }
};

// Default Agent Preferences
const DEFAULT_AGENT_PREFERENCES = {
    // Search Defaults
    defaultTripType: 'ONE_WAY',           // Default: One Way
    autoSelectTripType: true,              // Auto-select one way if not chosen for round trip searches

    // Fare Display
    fareDisplayMode: 'TOTAL',              // Default: Total fare
    showFareBreakdown: true,               // Show detailed fare breakdown

    // Search Preferences
    defaultClassOfTravel: 0,               // 0=Economy, 1=Business, 2=First
    defaultAdults: 1,
    defaultChildren: 0,
    defaultInfants: 0,

    // UI Preferences
    showCommission: true,                  // Show commission in results
    showNetFare: false,                    // Show net fare (for agents)
    autoExpandFirstResult: false,          // Auto-expand first flight result
    resultsPerPage: 20,

    // Booking Preferences
    autoHoldBooking: false,                // Auto-hold instead of instant ticket
    defaultGstEnabled: false,

    // Notification Preferences
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false
};

// Admin-level default overrides (can set for all agents under them)
const ADMIN_DEFAULT_PREFERENCES = {
    ...DEFAULT_AGENT_PREFERENCES,
    // Admin can enforce these for all sub-agents
    enforceDefaultTripType: false,
    enforceFareDisplayMode: false,
    enforceClassOfTravel: false
};

/**
 * Get default preferences with any overrides
 */
const getAgentPreferences = (agentSettings = {}, adminSettings = {}) => {
    const preferences = { ...DEFAULT_AGENT_PREFERENCES };

    // Apply admin-level overrides if enforced
    if (adminSettings.enforceDefaultTripType) {
        preferences.defaultTripType = adminSettings.defaultTripType;
    } else if (agentSettings.defaultTripType) {
        preferences.defaultTripType = agentSettings.defaultTripType;
    }

    if (adminSettings.enforceFareDisplayMode) {
        preferences.fareDisplayMode = adminSettings.fareDisplayMode;
    } else if (agentSettings.fareDisplayMode) {
        preferences.fareDisplayMode = agentSettings.fareDisplayMode;
    }

    // Apply other agent settings
    return {
        ...preferences,
        ...agentSettings,
        // Ensure enforced settings are not overridden
        ...(adminSettings.enforceDefaultTripType && { defaultTripType: adminSettings.defaultTripType }),
        ...(adminSettings.enforceFareDisplayMode && { fareDisplayMode: adminSettings.fareDisplayMode })
    };
};

/**
 * Validate preferences object
 */
const validatePreferences = (preferences) => {
    const errors = [];

    if (preferences.defaultTripType && !Object.keys(TRIP_TYPES).includes(preferences.defaultTripType)) {
        errors.push('Invalid default trip type');
    }

    if (preferences.fareDisplayMode && !Object.keys(FARE_DISPLAY_MODES).includes(preferences.fareDisplayMode)) {
        errors.push('Invalid fare display mode');
    }

    if (preferences.defaultClassOfTravel !== undefined &&
        (preferences.defaultClassOfTravel < 0 || preferences.defaultClassOfTravel > 2)) {
        errors.push('Invalid class of travel');
    }

    return errors;
};

/**
 * Calculate fare based on display mode
 */
const calculateDisplayFare = (fareDetails, displayMode, passengerCount) => {
    const totalFare = fareDetails.reduce((sum, fd) => sum + (fd.totalAmount || 0), 0);

    if (displayMode === 'PER_PERSON') {
        return {
            displayAmount: totalFare / passengerCount,
            label: 'per person',
            totalAmount: totalFare
        };
    }

    return {
        displayAmount: totalFare,
        label: 'total',
        totalAmount: totalFare
    };
};

module.exports = {
    TRIP_TYPES,
    FARE_DISPLAY_MODES,
    DEFAULT_AGENT_PREFERENCES,
    ADMIN_DEFAULT_PREFERENCES,
    getAgentPreferences,
    validatePreferences,
    calculateDisplayFare
};
