/**
 * Validation Middleware
 * Request validation using Joi schemas
 */

const Joi = require('joi');

/**
 * Generic validation middleware factory
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const details = error.details.map(d => ({
                field: d.path.join('.'),
                message: d.message
            }));

            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details
                }
            });
        }

        req[property] = value;
        next();
    };
};

// =====================================================
// COMMON SCHEMAS
// =====================================================

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

const dateRangeSchema = Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate'))
});

// =====================================================
// AUTH SCHEMAS
// =====================================================

const authSchemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
        companyName: Joi.string(),
        panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
        gstNumber: Joi.string(),
        address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            pincode: Joi.string(),
            country: Joi.string().default('India')
        })
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    changePassword: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required()
    }),

    forgotPassword: Joi.object({
        email: Joi.string().email().required()
    }),

    resetPassword: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(8).required()
    })
};

// =====================================================
// FLIGHT SCHEMAS
// =====================================================

const flightSchemas = {
    search: Joi.object({
        tripType: Joi.string().valid('oneway', 'roundtrip', 'multicity').required(),
        origin: Joi.string().length(3).uppercase().required(),
        destination: Joi.string().length(3).uppercase().required(),
        departureDate: Joi.date().iso().min('now').required(),
        returnDate: Joi.when('tripType', {
            is: 'roundtrip',
            then: Joi.date().iso().min(Joi.ref('departureDate')).required(),
            otherwise: Joi.forbidden()
        }),
        adults: Joi.number().integer().min(1).max(9).required(),
        children: Joi.number().integer().min(0).max(8).default(0),
        infants: Joi.number().integer().min(0).max(4).default(0),
        cabinClass: Joi.string().valid('economy', 'premium_economy', 'business', 'first').default('economy'),
        directOnly: Joi.boolean().default(false),
        preferredAirlines: Joi.array().items(Joi.string().length(2)),
        multiCitySegments: Joi.when('tripType', {
            is: 'multicity',
            then: Joi.array().items(
                Joi.object({
                    origin: Joi.string().length(3).uppercase().required(),
                    destination: Joi.string().length(3).uppercase().required(),
                    departureDate: Joi.date().iso().required()
                })
            ).min(2).required(),
            otherwise: Joi.forbidden()
        })
    }),

    reprice: Joi.object({
        searchKey: Joi.string().required(),
        flightKey: Joi.string().required()
    }),

    booking: Joi.object({
        searchKey: Joi.string().required(),
        flightKey: Joi.string().required(),
        passengers: Joi.array().items(
            Joi.object({
                type: Joi.string().valid('adult', 'child', 'infant').required(),
                title: Joi.string().valid('Mr', 'Mrs', 'Ms', 'Mstr', 'Miss').required(),
                firstName: Joi.string().min(2).required(),
                lastName: Joi.string().min(2).required(),
                gender: Joi.string().valid('M', 'F').required(),
                dateOfBirth: Joi.date().iso(),
                passportNumber: Joi.string(),
                passportExpiry: Joi.date().iso(),
                nationality: Joi.string().length(2).default('IN')
            })
        ).min(1).required(),
        contact: Joi.object({
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            countryCode: Joi.string().default('+91')
        }).required(),
        gstDetails: Joi.object({
            gstNumber: Joi.string(),
            companyName: Joi.string(),
            companyAddress: Joi.string(),
            companyEmail: Joi.string().email()
        }),
        addons: Joi.object({
            meals: Joi.array().items(Joi.object({
                passengerId: Joi.number().required(),
                segmentId: Joi.number().required(),
                mealCode: Joi.string().required()
            })),
            baggage: Joi.array().items(Joi.object({
                passengerId: Joi.number().required(),
                segmentId: Joi.number().required(),
                baggageCode: Joi.string().required()
            })),
            seats: Joi.array().items(Joi.object({
                passengerId: Joi.number().required(),
                segmentId: Joi.number().required(),
                seatNumber: Joi.string().required()
            }))
        })
    })
};

// =====================================================
// HOTEL SCHEMAS
// =====================================================

const hotelSchemas = {
    search: Joi.object({
        destination: Joi.string().required(),
        destinationType: Joi.string().valid('city', 'hotel', 'area').default('city'),
        checkIn: Joi.date().iso().min('now').required(),
        checkOut: Joi.date().iso().min(Joi.ref('checkIn')).required(),
        rooms: Joi.array().items(
            Joi.object({
                adults: Joi.number().integer().min(1).max(4).required(),
                children: Joi.number().integer().min(0).max(3).default(0),
                childAges: Joi.array().items(Joi.number().min(0).max(17))
            })
        ).min(1).max(8).required(),
        starRating: Joi.array().items(Joi.number().min(1).max(5)),
        priceRange: Joi.object({
            min: Joi.number().min(0),
            max: Joi.number().min(Joi.ref('min'))
        }),
        amenities: Joi.array().items(Joi.string()),
        nationality: Joi.string().length(2).default('IN')
    }),

    roomDetails: Joi.object({
        hotelId: Joi.string().required(),
        searchKey: Joi.string().required()
    }),

    booking: Joi.object({
        hotelId: Joi.string().required(),
        roomId: Joi.string().required(),
        searchKey: Joi.string().required(),
        guests: Joi.array().items(
            Joi.object({
                roomIndex: Joi.number().required(),
                title: Joi.string().valid('Mr', 'Mrs', 'Ms').required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                isLeadGuest: Joi.boolean().default(false)
            })
        ).min(1).required(),
        contact: Joi.object({
            email: Joi.string().email().required(),
            phone: Joi.string().required()
        }).required(),
        specialRequests: Joi.string().max(500)
    })
};

// =====================================================
// BUS SCHEMAS
// =====================================================

const busSchemas = {
    search: Joi.object({
        origin: Joi.string().required(),
        destination: Joi.string().required(),
        travelDate: Joi.date().iso().min('now').required(),
        returnDate: Joi.date().iso().min(Joi.ref('travelDate'))
    }),

    seatLayout: Joi.object({
        busId: Joi.string().required(),
        searchKey: Joi.string().required()
    }),

    booking: Joi.object({
        busId: Joi.string().required(),
        searchKey: Joi.string().required(),
        seats: Joi.array().items(Joi.string()).min(1).required(),
        boardingPoint: Joi.string().required(),
        droppingPoint: Joi.string().required(),
        passengers: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                age: Joi.number().min(1).max(120).required(),
                gender: Joi.string().valid('M', 'F').required(),
                seatNumber: Joi.string().required()
            })
        ).min(1).required(),
        contact: Joi.object({
            email: Joi.string().email().required(),
            phone: Joi.string().required()
        }).required()
    })
};

// =====================================================
// HOLIDAY SCHEMAS
// =====================================================

const holidaySchemas = {
    search: Joi.object({
        destination: Joi.string(),
        theme: Joi.string().valid('beach', 'adventure', 'cultural', 'honeymoon', 'family', 'pilgrimage'),
        duration: Joi.object({
            min: Joi.number().min(1),
            max: Joi.number().min(Joi.ref('min'))
        }),
        budget: Joi.object({
            min: Joi.number().min(0),
            max: Joi.number().min(Joi.ref('min'))
        }),
        departureCity: Joi.string(),
        travelMonth: Joi.string()
    }),

    inquiry: Joi.object({
        packageId: Joi.string().required(),
        travelers: Joi.object({
            adults: Joi.number().min(1).required(),
            children: Joi.number().min(0).default(0),
            infants: Joi.number().min(0).default(0)
        }).required(),
        travelDate: Joi.date().iso().min('now').required(),
        departureCity: Joi.string().required(),
        specialRequirements: Joi.string(),
        contact: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required()
        }).required()
    })
};

// =====================================================
// BOOKING SCHEMAS
// =====================================================

const bookingSchemas = {
    cancel: Joi.object({
        reason: Joi.string().required(),
        remarks: Joi.string()
    }),

    amendPassenger: Joi.object({
        passengerId: Joi.number().required(),
        firstName: Joi.string(),
        lastName: Joi.string()
    })
};

// =====================================================
// WALLET SCHEMAS
// =====================================================

const walletSchemas = {
    topup: Joi.object({
        amount: Joi.number().min(100).required(),
        paymentMethod: Joi.string().valid('razorpay', 'payu', 'bank_transfer', 'cheque').required(),
        reference: Joi.string()
    }),

    transfer: Joi.object({
        toAgentId: Joi.number().required(),
        amount: Joi.number().min(1).required(),
        remarks: Joi.string()
    })
};

// =====================================================
// ADMIN SCHEMAS
// =====================================================

const adminSchemas = {
    createAgent: Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        companyName: Joi.string(),
        groupId: Joi.number(),
        schemeId: Joi.number(),
        creditLimit: Joi.number().min(0).default(0),
        commissionType: Joi.string().valid('percentage', 'fixed').default('percentage'),
        commissionValue: Joi.number().min(0).default(0)
    }),

    updateMarkup: Joi.object({
        productType: Joi.string().valid('flight', 'hotel', 'bus', 'holiday', 'activity', 'insurance', 'visa', 'transfer').required(),
        markupType: Joi.string().valid('percentage', 'fixed').required(),
        markupValue: Joi.number().min(0).required(),
        applicableTo: Joi.string().valid('all', 'group', 'agent').required(),
        targetId: Joi.number().when('applicableTo', {
            is: Joi.valid('group', 'agent'),
            then: Joi.required()
        }),
        conditions: Joi.object({
            supplier: Joi.string(),
            airline: Joi.string(),
            cabinClass: Joi.string(),
            route: Joi.object({
                origin: Joi.string(),
                destination: Joi.string()
            })
        })
    }),

    createScheme: Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        products: Joi.array().items(
            Joi.object({
                productType: Joi.string().required(),
                commissionType: Joi.string().valid('percentage', 'fixed').required(),
                commissionValue: Joi.number().min(0).required(),
                conditions: Joi.object()
            })
        ).min(1).required(),
        isActive: Joi.boolean().default(true)
    }),

    whitelabelSettings: Joi.object({
        domain: Joi.string().domain(),
        brandName: Joi.string(),
        logo: Joi.string().uri(),
        favicon: Joi.string().uri(),
        primaryColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
        secondaryColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
        supportEmail: Joi.string().email(),
        supportPhone: Joi.string(),
        socialLinks: Joi.object({
            facebook: Joi.string().uri(),
            twitter: Joi.string().uri(),
            instagram: Joi.string().uri(),
            linkedin: Joi.string().uri()
        }),
        seoSettings: Joi.object({
            title: Joi.string(),
            description: Joi.string(),
            keywords: Joi.array().items(Joi.string())
        })
    })
};

module.exports = {
    validate,
    paginationSchema,
    dateRangeSchema,
    authSchemas,
    flightSchemas,
    hotelSchemas,
    busSchemas,
    holidaySchemas,
    bookingSchemas,
    walletSchemas,
    adminSchemas
};
