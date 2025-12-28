/**
 * Input Validation & Sanitization Layer
 * Comprehensive schema-based validation for all API inputs
 */

/**
 * Validation Error Class
 */
class ValidationError extends Error {
    constructor(message, field, code) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.code = code;
        this.status = 400;
    }
}

/**
 * Validator Types
 */
const validators = {
    // String validators
    string: (value, options = {}) => {
        if (typeof value !== 'string') {
            throw new ValidationError('Must be a string', options.field, 'INVALID_TYPE');
        }
        if (options.minLength && value.length < options.minLength) {
            throw new ValidationError(`Minimum length is ${options.minLength}`, options.field, 'MIN_LENGTH');
        }
        if (options.maxLength && value.length > options.maxLength) {
            throw new ValidationError(`Maximum length is ${options.maxLength}`, options.field, 'MAX_LENGTH');
        }
        if (options.pattern && !options.pattern.test(value)) {
            throw new ValidationError('Invalid format', options.field, 'INVALID_FORMAT');
        }
        if (options.enum && !options.enum.includes(value)) {
            throw new ValidationError(`Must be one of: ${options.enum.join(', ')}`, options.field, 'INVALID_ENUM');
        }
        return value.trim();
    },

    // Number validators
    number: (value, options = {}) => {
        const num = Number(value);
        if (isNaN(num)) {
            throw new ValidationError('Must be a number', options.field, 'INVALID_TYPE');
        }
        if (options.min !== undefined && num < options.min) {
            throw new ValidationError(`Minimum value is ${options.min}`, options.field, 'MIN_VALUE');
        }
        if (options.max !== undefined && num > options.max) {
            throw new ValidationError(`Maximum value is ${options.max}`, options.field, 'MAX_VALUE');
        }
        if (options.integer && !Number.isInteger(num)) {
            throw new ValidationError('Must be an integer', options.field, 'INVALID_INTEGER');
        }
        return num;
    },

    // Boolean validator
    boolean: (value, options = {}) => {
        if (typeof value === 'boolean') return value;
        if (value === 'true' || value === '1') return true;
        if (value === 'false' || value === '0') return false;
        throw new ValidationError('Must be a boolean', options.field, 'INVALID_TYPE');
    },

    // Email validator
    email: (value, options = {}) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (typeof value !== 'string' || !emailRegex.test(value)) {
            throw new ValidationError('Invalid email address', options.field, 'INVALID_EMAIL');
        }
        if (value.length > 254) {
            throw new ValidationError('Email too long', options.field, 'EMAIL_TOO_LONG');
        }
        return value.toLowerCase().trim();
    },

    // Phone validator
    phone: (value, options = {}) => {
        const phoneRegex = /^\+?[1-9]\d{6,14}$/;
        const cleaned = String(value).replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleaned)) {
            throw new ValidationError('Invalid phone number', options.field, 'INVALID_PHONE');
        }
        return cleaned;
    },

    // Date validator
    date: (value, options = {}) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new ValidationError('Invalid date', options.field, 'INVALID_DATE');
        }
        if (options.future && date <= new Date()) {
            throw new ValidationError('Date must be in the future', options.field, 'DATE_NOT_FUTURE');
        }
        if (options.past && date >= new Date()) {
            throw new ValidationError('Date must be in the past', options.field, 'DATE_NOT_PAST');
        }
        if (options.minDate && date < new Date(options.minDate)) {
            throw new ValidationError(`Date must be after ${options.minDate}`, options.field, 'DATE_TOO_EARLY');
        }
        if (options.maxDate && date > new Date(options.maxDate)) {
            throw new ValidationError(`Date must be before ${options.maxDate}`, options.field, 'DATE_TOO_LATE');
        }
        return date.toISOString();
    },

    // UUID validator
    uuid: (value, options = {}) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) {
            throw new ValidationError('Invalid UUID', options.field, 'INVALID_UUID');
        }
        return value.toLowerCase();
    },

    // URL validator
    url: (value, options = {}) => {
        try {
            const url = new URL(value);
            if (options.protocols && !options.protocols.includes(url.protocol.replace(':', ''))) {
                throw new ValidationError(`Protocol must be: ${options.protocols.join(', ')}`, options.field, 'INVALID_PROTOCOL');
            }
            return url.toString();
        } catch {
            throw new ValidationError('Invalid URL', options.field, 'INVALID_URL');
        }
    },

    // Array validator
    array: (value, options = {}) => {
        if (!Array.isArray(value)) {
            throw new ValidationError('Must be an array', options.field, 'INVALID_TYPE');
        }
        if (options.minLength && value.length < options.minLength) {
            throw new ValidationError(`Minimum ${options.minLength} items required`, options.field, 'ARRAY_MIN_LENGTH');
        }
        if (options.maxLength && value.length > options.maxLength) {
            throw new ValidationError(`Maximum ${options.maxLength} items allowed`, options.field, 'ARRAY_MAX_LENGTH');
        }
        if (options.itemType) {
            return value.map((item, index) =>
                validators[options.itemType](item, { ...options.itemOptions, field: `${options.field}[${index}]` })
            );
        }
        return value;
    },

    // Object validator
    object: (value, options = {}) => {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw new ValidationError('Must be an object', options.field, 'INVALID_TYPE');
        }
        return value;
    },

    // Airport code validator
    airportCode: (value, options = {}) => {
        const code = String(value).toUpperCase().trim();
        if (!/^[A-Z]{3}$/.test(code)) {
            throw new ValidationError('Invalid airport code (must be 3 letters)', options.field, 'INVALID_AIRPORT_CODE');
        }
        return code;
    },

    // Airline code validator
    airlineCode: (value, options = {}) => {
        const code = String(value).toUpperCase().trim();
        if (!/^[A-Z0-9]{2}$/.test(code)) {
            throw new ValidationError('Invalid airline code (must be 2 characters)', options.field, 'INVALID_AIRLINE_CODE');
        }
        return code;
    },

    // Currency code validator
    currencyCode: (value, options = {}) => {
        const code = String(value).toUpperCase().trim();
        if (!/^[A-Z]{3}$/.test(code)) {
            throw new ValidationError('Invalid currency code', options.field, 'INVALID_CURRENCY_CODE');
        }
        return code;
    },

    // PNR validator
    pnr: (value, options = {}) => {
        const pnr = String(value).toUpperCase().trim();
        if (!/^[A-Z0-9]{6}$/.test(pnr)) {
            throw new ValidationError('Invalid PNR format', options.field, 'INVALID_PNR');
        }
        return pnr;
    },

    // Password validator
    password: (value, options = {}) => {
        const minLength = options.minLength || 8;
        if (typeof value !== 'string' || value.length < minLength) {
            throw new ValidationError(`Password must be at least ${minLength} characters`, options.field, 'PASSWORD_TOO_SHORT');
        }
        if (options.requireUppercase && !/[A-Z]/.test(value)) {
            throw new ValidationError('Password must contain uppercase letter', options.field, 'PASSWORD_NO_UPPERCASE');
        }
        if (options.requireLowercase && !/[a-z]/.test(value)) {
            throw new ValidationError('Password must contain lowercase letter', options.field, 'PASSWORD_NO_LOWERCASE');
        }
        if (options.requireNumber && !/\d/.test(value)) {
            throw new ValidationError('Password must contain a number', options.field, 'PASSWORD_NO_NUMBER');
        }
        if (options.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            throw new ValidationError('Password must contain special character', options.field, 'PASSWORD_NO_SPECIAL');
        }
        return value;
    },

    // IP Address validator
    ipAddress: (value, options = {}) => {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

        if (!ipv4Regex.test(value) && !ipv6Regex.test(value)) {
            throw new ValidationError('Invalid IP address', options.field, 'INVALID_IP');
        }
        return value;
    },

    // Credit card validator (basic Luhn check)
    creditCard: (value, options = {}) => {
        const cleaned = String(value).replace(/\D/g, '');
        if (cleaned.length < 13 || cleaned.length > 19) {
            throw new ValidationError('Invalid card number length', options.field, 'INVALID_CARD_LENGTH');
        }

        // Luhn algorithm
        let sum = 0;
        let isEven = false;
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i], 10);
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            isEven = !isEven;
        }

        if (sum % 10 !== 0) {
            throw new ValidationError('Invalid card number', options.field, 'INVALID_CARD_NUMBER');
        }

        // Return masked card number
        return cleaned.slice(0, 4) + '****' + cleaned.slice(-4);
    }
};

/**
 * Schema Validator
 */
class SchemaValidator {
    constructor(schema) {
        this.schema = schema;
    }

    validate(data) {
        const errors = [];
        const validated = {};

        for (const [field, rules] of Object.entries(this.schema)) {
            try {
                const value = this.getNestedValue(data, field);

                // Check required
                if (rules.required && (value === undefined || value === null || value === '')) {
                    throw new ValidationError(`${field} is required`, field, 'REQUIRED');
                }

                // Skip validation if not required and empty
                if (!rules.required && (value === undefined || value === null || value === '')) {
                    if (rules.default !== undefined) {
                        validated[field] = rules.default;
                    }
                    continue;
                }

                // Validate type
                const validator = validators[rules.type];
                if (!validator) {
                    throw new ValidationError(`Unknown validator type: ${rules.type}`, field, 'UNKNOWN_VALIDATOR');
                }

                validated[field] = validator(value, { ...rules, field });

                // Custom validation
                if (rules.custom && typeof rules.custom === 'function') {
                    const customResult = rules.custom(validated[field], data);
                    if (customResult !== true) {
                        throw new ValidationError(customResult || 'Custom validation failed', field, 'CUSTOM_VALIDATION');
                    }
                }

            } catch (error) {
                if (error instanceof ValidationError) {
                    errors.push({
                        field: error.field,
                        message: error.message,
                        code: error.code
                    });
                } else {
                    errors.push({
                        field,
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    });
                }
            }
        }

        if (errors.length > 0) {
            return { valid: false, errors, data: null };
        }

        return { valid: true, errors: [], data: validated };
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
}

/**
 * Pre-built Schemas for Common Operations
 */
const schemas = {
    // User registration
    registration: {
        email: { type: 'email', required: true },
        password: {
            type: 'password',
            required: true,
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumber: true
        },
        name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
        phone: { type: 'phone', required: true }
    },

    // Login
    login: {
        email: { type: 'email', required: true },
        password: { type: 'string', required: true }
    },

    // Flight search
    flightSearch: {
        origin: { type: 'airportCode', required: true },
        destination: { type: 'airportCode', required: true },
        departureDate: { type: 'date', required: true, future: true },
        returnDate: { type: 'date', required: false, future: true },
        adults: { type: 'number', required: true, min: 1, max: 9, integer: true },
        children: { type: 'number', required: false, min: 0, max: 9, integer: true, default: 0 },
        infants: { type: 'number', required: false, min: 0, max: 4, integer: true, default: 0 },
        cabinClass: { type: 'string', required: false, enum: ['economy', 'premium_economy', 'business', 'first'], default: 'economy' }
    },

    // Hotel search
    hotelSearch: {
        destination: { type: 'string', required: true, minLength: 2 },
        checkIn: { type: 'date', required: true, future: true },
        checkOut: { type: 'date', required: true, future: true },
        rooms: { type: 'number', required: true, min: 1, max: 10, integer: true },
        guests: { type: 'number', required: true, min: 1, max: 30, integer: true }
    },

    // Insurance search
    insuranceSearch: {
        tripType: { type: 'string', required: true, enum: ['domestic', 'international', 'schengen'] },
        tripStartDate: { type: 'date', required: true, future: true },
        tripEndDate: { type: 'date', required: true, future: true },
        travelers: { type: 'array', required: true, minLength: 1, maxLength: 10 }
    },

    // Payment
    payment: {
        amount: { type: 'number', required: true, min: 1 },
        currency: { type: 'currencyCode', required: true },
        gateway: { type: 'string', required: true, enum: ['razorpay', 'payu', 'ccavenue', 'stripe', 'paypal'] },
        bookingId: { type: 'string', required: true }
    },

    // Booking
    booking: {
        flightId: { type: 'string', required: true },
        passengers: { type: 'array', required: true, minLength: 1 },
        contactEmail: { type: 'email', required: true },
        contactPhone: { type: 'phone', required: true }
    }
};

/**
 * Validation Middleware Factory
 */
const validate = (schemaName, source = 'body') => {
    const schema = schemas[schemaName];
    if (!schema) {
        throw new Error(`Unknown schema: ${schemaName}`);
    }

    const validator = new SchemaValidator(schema);

    return (req, res, next) => {
        const data = req[source];
        const result = validator.validate(data);

        if (!result.valid) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: result.errors
            });
        }

        // Replace with validated data
        req[`validated${source.charAt(0).toUpperCase() + source.slice(1)}`] = result.data;
        next();
    };
};

/**
 * Custom Schema Validation Middleware
 */
const validateSchema = (schema, source = 'body') => {
    const validator = new SchemaValidator(schema);

    return (req, res, next) => {
        const data = req[source];
        const result = validator.validate(data);

        if (!result.valid) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: result.errors
            });
        }

        req.validatedData = result.data;
        next();
    };
};

module.exports = {
    ValidationError,
    SchemaValidator,
    validators,
    schemas,
    validate,
    validateSchema
};
