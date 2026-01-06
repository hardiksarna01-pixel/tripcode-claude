/**
 * Application Configuration
 * Centralized configuration management
 */

require('dotenv').config();

module.exports = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3001,
        env: process.env.NODE_ENV || 'development',
        apiPrefix: '/api/v1'
    },

    // Database Configuration
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'travel_portal',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        poolMin: parseInt(process.env.DB_POOL_MIN) || 2,
        poolMax: parseInt(process.env.DB_POOL_MAX) || 10
    },

    // Redis Configuration
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: process.env.REDIS_DB || 0
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        adminSecret: process.env.ADMIN_JWT_SECRET || 'your-admin-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },

    // Encryption
    encryption: {
        key: process.env.ENCRYPTION_KEY || 'your-32-character-secret-key!!',
        algorithm: 'aes-256-gcm'
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true
    },

    // File Upload
    upload: {
        maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        storagePath: process.env.UPLOAD_PATH || './uploads'
    },

    // Email Configuration
    email: {
        provider: process.env.EMAIL_PROVIDER || 'smtp', // smtp, sendgrid, ses
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            user: process.env.SMTP_USER || '',
            password: process.env.SMTP_PASSWORD || ''
        },
        from: {
            name: process.env.EMAIL_FROM_NAME || 'Travel Portal',
            email: process.env.EMAIL_FROM_ADDRESS || 'noreply@travelportal.com'
        }
    },

    // SMS Configuration
    sms: {
        provider: process.env.SMS_PROVIDER || 'msg91', // msg91, twilio, nexmo
        msg91: {
            authKey: process.env.MSG91_AUTH_KEY || '',
            senderId: process.env.MSG91_SENDER_ID || ''
        },
        twilio: {
            accountSid: process.env.TWILIO_ACCOUNT_SID || '',
            authToken: process.env.TWILIO_AUTH_TOKEN || '',
            phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
        }
    },

    // WhatsApp Configuration
    whatsapp: {
        provider: process.env.WHATSAPP_PROVIDER || 'wati', // wati, twilio, meta
        wati: {
            apiUrl: process.env.WATI_API_URL || '',
            apiKey: process.env.WATI_API_KEY || ''
        },
        meta: {
            phoneNumberId: process.env.META_PHONE_NUMBER_ID || '',
            accessToken: process.env.META_ACCESS_TOKEN || ''
        }
    },

    // Payment Gateways
    payments: {
        razorpay: {
            keyId: process.env.RAZORPAY_KEY_ID || '',
            keySecret: process.env.RAZORPAY_KEY_SECRET || '',
            webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
        },
        payu: {
            merchantKey: process.env.PAYU_MERCHANT_KEY || '',
            merchantSalt: process.env.PAYU_MERCHANT_SALT || '',
            isTestMode: process.env.PAYU_TEST_MODE === 'true'
        },
        stripe: {
            secretKey: process.env.STRIPE_SECRET_KEY || '',
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
        }
    },

    // AI Configuration
    ai: {
        provider: process.env.AI_PROVIDER || 'openai', // openai, anthropic
        openai: {
            apiKey: process.env.OPENAI_API_KEY || '',
            model: process.env.OPENAI_MODEL || 'gpt-4'
        },
        anthropic: {
            apiKey: process.env.ANTHROPIC_API_KEY || '',
            model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet'
        }
    },

    // Flight API Suppliers
    flightSuppliers: {
        amadeus: {
            apiUrl: process.env.AMADEUS_API_URL || '',
            apiKey: process.env.AMADEUS_API_KEY || '',
            apiSecret: process.env.AMADEUS_API_SECRET || ''
        },
        tbo: {
            apiUrl: process.env.TBO_API_URL || '',
            userId: process.env.TBO_USER_ID || '',
            password: process.env.TBO_PASSWORD || ''
        },
        tripjack: {
            apiUrl: process.env.TRIPJACK_API_URL || '',
            apiKey: process.env.TRIPJACK_API_KEY || ''
        }
    },

    // Hotel API Suppliers
    hotelSuppliers: {
        hotelbeds: {
            apiUrl: process.env.HOTELBEDS_API_URL || '',
            apiKey: process.env.HOTELBEDS_API_KEY || '',
            secret: process.env.HOTELBEDS_SECRET || ''
        },
        tbo: {
            apiUrl: process.env.TBO_HOTEL_API_URL || '',
            userId: process.env.TBO_HOTEL_USER_ID || '',
            password: process.env.TBO_HOTEL_PASSWORD || ''
        }
    },

    // Bus API Suppliers
    busSuppliers: {
        redbus: {
            apiUrl: process.env.REDBUS_API_URL || '',
            apiKey: process.env.REDBUS_API_KEY || ''
        },
        abhibus: {
            apiUrl: process.env.ABHIBUS_API_URL || '',
            apiKey: process.env.ABHIBUS_API_KEY || ''
        }
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined'
    },

    // Cache TTL (in seconds)
    cacheTTL: {
        flightSearch: 300, // 5 minutes
        hotelSearch: 600, // 10 minutes
        staticData: 86400, // 24 hours
        fareCalendar: 3600 // 1 hour
    }
};
