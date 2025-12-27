const Joi = require('joi');
const { FARE_TYPE_CODES } = require('../config/fareTypes');

/**
 * Validation middleware factory
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
        }

        next();
    };
};

/**
 * Flight search validation
 */
const searchSchema = Joi.object({
    origin: Joi.string().length(3).uppercase().required()
        .messages({ 'string.length': 'Origin must be a 3-letter airport code' }),
    destination: Joi.string().length(3).uppercase().required()
        .messages({ 'string.length': 'Destination must be a 3-letter airport code' }),
    travelDate: Joi.date().iso().min('now').required()
        .messages({ 'date.min': 'Travel date must be in the future' }),
    returnDate: Joi.date().iso().min(Joi.ref('travelDate')).when('tripType', {
        is: 1,
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    adults: Joi.number().integer().min(1).max(9).default(1),
    children: Joi.number().integer().min(0).max(8).default(0),
    infants: Joi.number().integer().min(0).max(4).default(0),
    classOfTravel: Joi.number().integer().min(0).max(3).default(0),
    tripType: Joi.number().integer().min(0).max(2).default(0),
    airlines: Joi.array().items(Joi.string().length(2)).default([]),
    fareType: Joi.string().valid(...FARE_TYPE_CODES).default('REGULAR'),
    // Legacy fields (still supported for backwards compatibility)
    seniorCitizen: Joi.boolean().default(false),
    studentFare: Joi.boolean().default(false),
    defenceFare: Joi.boolean().default(false)
}).custom((value, helpers) => {
    // Validate total passengers
    const total = value.adults + value.children + value.infants;
    if (total > 9) {
        return helpers.error('any.custom', { message: 'Total passengers cannot exceed 9' });
    }
    // Infants cannot exceed adults
    if (value.infants > value.adults) {
        return helpers.error('any.custom', { message: 'Infants cannot exceed number of adults' });
    }
    return value;
});

exports.validateSearch = validate(searchSchema);

/**
 * Reprice validation
 */
const repriceSchema = Joi.object({
    searchKey: Joi.string().required(),
    selectedFlights: Joi.array().items(
        Joi.object({
            flightId: Joi.string().required(),
            fareId: Joi.string().required()
        })
    ).min(1).required()
});

exports.validateReprice = validate(repriceSchema);

/**
 * Booking validation
 */
const passengerSchema = Joi.object({
    type: Joi.number().integer().min(0).max(2).required(), // 0=ADT, 1=CHD, 2=INF
    title: Joi.string().valid('Mr', 'Mrs', 'Ms', 'Mstr', 'Miss').required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    gender: Joi.string().valid('M', 'F').optional(),
    age: Joi.number().integer().min(0).max(120).optional(),
    dob: Joi.date().iso().max('now').optional(),
    passportNumber: Joi.string().optional(),
    passportExpiry: Joi.date().iso().min('now').optional(),
    passportCountry: Joi.string().length(2).optional(),
    panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional()
});

const bookingSchema = Joi.object({
    searchKey: Joi.string().required(),
    flightKey: Joi.string().required(),
    passengers: Joi.array().items(passengerSchema).min(1).required(),
    contact: Joi.object({
        name: Joi.string().required(),
        mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required()
            .messages({ 'string.pattern.base': 'Invalid Indian mobile number' }),
        email: Joi.string().email().required()
    }).required(),
    gstDetails: Joi.object({
        enabled: Joi.boolean().default(false),
        companyName: Joi.string().when('enabled', { is: true, then: Joi.required() }),
        gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
            .when('enabled', { is: true, then: Joi.required() }),
        address: Joi.string().optional(),
        mobile: Joi.string().optional(),
        email: Joi.string().email().optional()
    }).optional(),
    ssrSelections: Joi.array().items(
        Joi.object({
            paxId: Joi.number().integer().required(),
            ssrKey: Joi.string().required()
        })
    ).optional(),
    blockTicket: Joi.boolean().default(false)
});

exports.validateBooking = validate(bookingSchema);
