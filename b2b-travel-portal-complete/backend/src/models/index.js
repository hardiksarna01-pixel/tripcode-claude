/**
 * Sequelize Models Index
 * B2B/B2C Travel Portal
 */

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

// Initialize Sequelize
const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: config.database.dialect || 'postgres',
        logging: config.database.logging || false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// =====================================================
// MODEL DEFINITIONS
// =====================================================

// User Model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    type: {
        type: DataTypes.ENUM('agent', 'customer', 'admin', 'superadmin'),
        defaultValue: 'customer'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: DataTypes.DATE,
    refreshToken: DataTypes.STRING
}, {
    tableName: 'users',
    timestamps: true
});

// Company Model (for multi-tenancy)
const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        unique: true
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    logo: DataTypes.STRING,
    domain: DataTypes.STRING,
    settings: DataTypes.JSONB,
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'companies',
    timestamps: true
});

// Agent Model
const Agent = sequelize.define('Agent', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' }
    },
    companyId: {
        type: DataTypes.UUID,
        references: { model: 'companies', key: 'id' }
    },
    agencyName: DataTypes.STRING,
    agencyCode: {
        type: DataTypes.STRING,
        unique: true
    },
    iataCode: DataTypes.STRING,
    panNumber: DataTypes.STRING,
    gstNumber: DataTypes.STRING,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pincode: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('pending', 'active', 'suspended', 'rejected'),
        defaultValue: 'pending'
    },
    kycStatus: {
        type: DataTypes.ENUM('pending', 'submitted', 'verified', 'rejected'),
        defaultValue: 'pending'
    },
    groupId: DataTypes.UUID,
    schemeId: DataTypes.UUID,
    creditLimit: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    commissionRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    }
}, {
    tableName: 'agents',
    timestamps: true
});

// Customer Model
const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' }
    },
    loyaltyPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tier: {
        type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
        defaultValue: 'bronze'
    },
    preferences: DataTypes.JSONB,
    savedTravelers: DataTypes.JSONB
}, {
    tableName: 'customers',
    timestamps: true
});

// Wallet Model
const Wallet = sequelize.define('Wallet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    agentId: {
        type: DataTypes.UUID,
        references: { model: 'agents', key: 'id' }
    },
    balance: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    creditLimit: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    creditUsed: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    holdAmount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'wallets',
    timestamps: true
});

// Wallet Transaction Model
const WalletTransaction = sequelize.define('WalletTransaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    walletId: {
        type: DataTypes.UUID,
        references: { model: 'wallets', key: 'id' }
    },
    type: {
        type: DataTypes.ENUM('credit', 'debit', 'hold', 'release', 'refund'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    balance: DataTypes.DECIMAL(12, 2),
    description: DataTypes.STRING,
    referenceType: DataTypes.STRING,
    referenceId: DataTypes.UUID,
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'),
        defaultValue: 'completed'
    }
}, {
    tableName: 'wallet_transactions',
    timestamps: true
});

// Booking Model
const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bookingNumber: {
        type: DataTypes.STRING,
        unique: true
    },
    agentId: {
        type: DataTypes.UUID,
        references: { model: 'agents', key: 'id' }
    },
    customerId: {
        type: DataTypes.UUID,
        references: { model: 'customers', key: 'id' }
    },
    type: {
        type: DataTypes.ENUM('flight', 'hotel', 'bus', 'holiday', 'visa', 'insurance', 'transfer', 'activity'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    supplierBookingId: DataTypes.STRING,
    supplierPNR: DataTypes.STRING,
    bookingData: DataTypes.JSONB,
    travelerDetails: DataTypes.JSONB,
    pricing: DataTypes.JSONB,
    totalAmount: DataTypes.DECIMAL(12, 2),
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'partial', 'refunded'),
        defaultValue: 'pending'
    },
    paymentMethod: DataTypes.STRING,
    travelDate: DataTypes.DATE,
    returnDate: DataTypes.DATE,
    remarks: DataTypes.TEXT
}, {
    tableName: 'bookings',
    timestamps: true
});

// Passenger Model
const Passenger = sequelize.define('Passenger', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.UUID,
        references: { model: 'bookings', key: 'id' }
    },
    type: {
        type: DataTypes.ENUM('adult', 'child', 'infant'),
        defaultValue: 'adult'
    },
    title: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    nationality: DataTypes.STRING,
    passportNumber: DataTypes.STRING,
    passportExpiry: DataTypes.DATEONLY,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    ticketNumber: DataTypes.STRING,
    seatNumber: DataTypes.STRING,
    mealPreference: DataTypes.STRING,
    baggageAllowance: DataTypes.STRING
}, {
    tableName: 'passengers',
    timestamps: true
});

// Commission Model
const Commission = sequelize.define('Commission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    agentId: {
        type: DataTypes.UUID,
        references: { model: 'agents', key: 'id' }
    },
    bookingId: {
        type: DataTypes.UUID,
        references: { model: 'bookings', key: 'id' }
    },
    type: DataTypes.STRING,
    amount: DataTypes.DECIMAL(12, 2),
    percentage: DataTypes.DECIMAL(5, 2),
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'paid', 'rejected'),
        defaultValue: 'pending'
    },
    paidAt: DataTypes.DATE,
    remarks: DataTypes.TEXT
}, {
    tableName: 'commissions',
    timestamps: true
});

// Notification Model
const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' }
    },
    type: DataTypes.STRING,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    data: DataTypes.JSONB,
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    readAt: DataTypes.DATE
}, {
    tableName: 'notifications',
    timestamps: true
});

// Support Ticket Model
const SupportTicket = sequelize.define('SupportTicket', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    ticketNumber: {
        type: DataTypes.STRING,
        unique: true
    },
    userId: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' }
    },
    bookingId: DataTypes.UUID,
    category: DataTypes.STRING,
    subject: DataTypes.STRING,
    description: DataTypes.TEXT,
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium'
    },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
        defaultValue: 'open'
    },
    assignedTo: DataTypes.UUID,
    resolvedAt: DataTypes.DATE
}, {
    tableName: 'support_tickets',
    timestamps: true
});

// Subscription Model (for SaaS)
const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    companyId: {
        type: DataTypes.UUID,
        references: { model: 'companies', key: 'id' }
    },
    planId: DataTypes.UUID,
    planName: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('trial', 'active', 'expired', 'cancelled'),
        defaultValue: 'trial'
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    features: DataTypes.JSONB,
    pricing: DataTypes.JSONB,
    autoRenew: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'subscriptions',
    timestamps: true
});

// =====================================================
// MODEL ASSOCIATIONS
// =====================================================

// User associations
User.hasOne(Agent, { foreignKey: 'userId' });
User.hasOne(Customer, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });
User.hasMany(SupportTicket, { foreignKey: 'userId' });

// Agent associations
Agent.belongsTo(User, { foreignKey: 'userId' });
Agent.belongsTo(Company, { foreignKey: 'companyId' });
Agent.hasOne(Wallet, { foreignKey: 'agentId' });
Agent.hasMany(Booking, { foreignKey: 'agentId' });
Agent.hasMany(Commission, { foreignKey: 'agentId' });

// Customer associations
Customer.belongsTo(User, { foreignKey: 'userId' });
Customer.hasMany(Booking, { foreignKey: 'customerId' });

// Company associations
Company.hasMany(Agent, { foreignKey: 'companyId' });
Company.hasMany(Subscription, { foreignKey: 'companyId' });

// Wallet associations
Wallet.belongsTo(Agent, { foreignKey: 'agentId' });
Wallet.hasMany(WalletTransaction, { foreignKey: 'walletId' });

// WalletTransaction associations
WalletTransaction.belongsTo(Wallet, { foreignKey: 'walletId' });

// Booking associations
Booking.belongsTo(Agent, { foreignKey: 'agentId' });
Booking.belongsTo(Customer, { foreignKey: 'customerId' });
Booking.hasMany(Passenger, { foreignKey: 'bookingId' });
Booking.hasOne(Commission, { foreignKey: 'bookingId' });

// Passenger associations
Passenger.belongsTo(Booking, { foreignKey: 'bookingId' });

// Commission associations
Commission.belongsTo(Agent, { foreignKey: 'agentId' });
Commission.belongsTo(Booking, { foreignKey: 'bookingId' });

// Subscription associations
Subscription.belongsTo(Company, { foreignKey: 'companyId' });

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    sequelize,
    Sequelize,
    User,
    Company,
    Agent,
    Customer,
    Wallet,
    WalletTransaction,
    Booking,
    Passenger,
    Commission,
    Notification,
    SupportTicket,
    Subscription,
    Op: Sequelize.Op
};
