-- =====================================================
-- B2B/B2C TRAVEL PORTAL - COMPLETE DATABASE SCHEMA
-- Version 2.0 - All Features Included
-- =====================================================

-- =====================================================
-- 1. TENANT & WHITELABEL MANAGEMENT
-- =====================================================

CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    tenant_code VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    tenant_type VARCHAR(20) DEFAULT 'B2B', -- B2B, B2C, WHITELABEL

    -- Domain Configuration
    primary_domain VARCHAR(255),
    custom_domains JSONB DEFAULT '[]',
    ssl_enabled BOOLEAN DEFAULT false,
    ssl_certificate_path VARCHAR(500),

    -- Branding
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    primary_color VARCHAR(10) DEFAULT '#1976d2',
    secondary_color VARCHAR(10) DEFAULT '#424242',
    accent_color VARCHAR(10) DEFAULT '#ff9800',
    font_family VARCHAR(100) DEFAULT 'Inter, sans-serif',
    custom_css TEXT,

    -- Contact Info
    support_email VARCHAR(255),
    support_phone VARCHAR(20),
    address TEXT,

    -- Settings
    default_currency VARCHAR(3) DEFAULT 'INR',
    default_language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',

    -- Features Enabled
    features_enabled JSONB DEFAULT '{
        "flights": true,
        "hotels": true,
        "bus": true,
        "holidays": true,
        "activities": true,
        "insurance": true,
        "visa": false,
        "transfers": false,
        "b2c_enabled": false,
        "ai_features": false
    }',

    -- Billing
    billing_plan VARCHAR(50) DEFAULT 'STARTER',
    billing_cycle VARCHAR(20) DEFAULT 'MONTHLY',
    next_billing_date DATE,

    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. ADMIN USERS & ROLES (Multi-tenant)
-- =====================================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    role_name VARCHAR(50) NOT NULL,
    role_code VARCHAR(30) NOT NULL,
    role_level INTEGER DEFAULT 0, -- 0=Custom, 1=Staff, 2=Manager, 3=Admin, 4=SuperAdmin
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_system_role BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, role_code)
);

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    mobile VARCHAR(20),
    avatar_url VARCHAR(500),
    role_id INTEGER REFERENCES roles(id),

    -- Permissions override
    additional_permissions JSONB DEFAULT '[]',
    restricted_permissions JSONB DEFAULT '[]',

    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(100),
    password_changed_at TIMESTAMP,
    must_change_password BOOLEAN DEFAULT false,

    -- Status
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(50),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- =====================================================
-- 3. GROUPS & SCHEMES (Enhanced)
-- =====================================================

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    group_name VARCHAR(100) NOT NULL,
    group_code VARCHAR(20) NOT NULL,
    description TEXT,
    parent_group_id INTEGER REFERENCES groups(id),
    default_scheme_id INTEGER,

    -- Credit Settings
    credit_limit DECIMAL(15,2) DEFAULT 0,
    credit_period_days INTEGER DEFAULT 0,

    -- Features
    allowed_products JSONB DEFAULT '["flights", "hotels", "bus", "holidays"]',

    is_active BOOLEAN DEFAULT true,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, group_code)
);

CREATE TABLE schemes (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    scheme_name VARCHAR(100) NOT NULL,
    scheme_code VARCHAR(20) NOT NULL,
    description TEXT,

    -- Flight Settings (Domestic)
    flight_domestic_service_fee_type VARCHAR(20) DEFAULT 'FLAT',
    flight_domestic_service_fee_value DECIMAL(10,2) DEFAULT 0,
    flight_domestic_markup_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    flight_domestic_markup_value DECIMAL(10,2) DEFAULT 0,
    flight_domestic_commission_share DECIMAL(5,2) DEFAULT 0,

    -- Flight Settings (International)
    flight_intl_service_fee_type VARCHAR(20) DEFAULT 'FLAT',
    flight_intl_service_fee_value DECIMAL(10,2) DEFAULT 0,
    flight_intl_markup_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    flight_intl_markup_value DECIMAL(10,2) DEFAULT 0,
    flight_intl_commission_share DECIMAL(5,2) DEFAULT 0,

    -- Hotel Settings
    hotel_markup_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    hotel_markup_value DECIMAL(10,2) DEFAULT 0,
    hotel_commission_share DECIMAL(5,2) DEFAULT 0,

    -- Bus Settings
    bus_markup_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    bus_markup_value DECIMAL(10,2) DEFAULT 0,
    bus_commission_share DECIMAL(5,2) DEFAULT 0,

    -- Holiday Settings
    holiday_markup_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    holiday_markup_value DECIMAL(10,2) DEFAULT 0,

    -- Activity Settings
    activity_markup_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    activity_markup_value DECIMAL(10,2) DEFAULT 0,

    -- Insurance Settings
    insurance_commission_share DECIMAL(5,2) DEFAULT 0,

    -- Tax Settings
    apply_gst BOOLEAN DEFAULT true,
    gst_rate DECIMAL(5,2) DEFAULT 18.00,
    apply_tds BOOLEAN DEFAULT true,
    tds_rate DECIMAL(5,2) DEFAULT 2.00,

    -- General Settings
    allow_credit BOOLEAN DEFAULT false,
    max_credit_limit DECIMAL(15,2) DEFAULT 0,
    auto_ticket BOOLEAN DEFAULT false,
    block_ticket_allowed BOOLEAN DEFAULT true,
    block_ticket_duration_hours INTEGER DEFAULT 24,

    is_active BOOLEAN DEFAULT true,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, scheme_code)
);

-- =====================================================
-- 4. GLOBAL MARKUP RULES
-- =====================================================

CREATE TABLE global_markup_rules (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    rule_name VARCHAR(100) NOT NULL,

    -- Applicability
    product_type VARCHAR(30) NOT NULL, -- FLIGHT, HOTEL, BUS, HOLIDAY, ACTIVITY, INSURANCE
    supplier_id INTEGER,
    airline_code VARCHAR(3),
    route_origin VARCHAR(3),
    route_destination VARCHAR(3),
    travel_type VARCHAR(20), -- DOMESTIC, INTERNATIONAL
    fare_type VARCHAR(30),
    fare_class VARCHAR(10),

    -- Date Range
    travel_date_from DATE,
    travel_date_to DATE,
    booking_date_from DATE,
    booking_date_to DATE,

    -- Days of Week (JSON array: [0,1,2,3,4,5,6])
    applicable_days JSONB,

    -- Markup
    markup_type VARCHAR(20) NOT NULL, -- FLAT, PERCENTAGE, PER_PAX
    markup_value DECIMAL(10,2) NOT NULL,

    -- Conditions
    min_fare DECIMAL(15,2),
    max_fare DECIMAL(15,2),

    -- Priority (higher = applied first)
    priority INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. API SUPPLIERS (All Product Types)
-- =====================================================

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    supplier_name VARCHAR(100) NOT NULL,
    supplier_code VARCHAR(30) NOT NULL,
    supplier_type VARCHAR(30) NOT NULL, -- GDS, AGGREGATOR, DIRECT, LCC
    product_types JSONB DEFAULT '["flights"]', -- Array of product types

    -- API Configuration
    api_base_url VARCHAR(500),
    api_version VARCHAR(20),
    auth_type VARCHAR(30) DEFAULT 'BASIC', -- BASIC, API_KEY, OAUTH, CUSTOM
    api_credentials JSONB, -- Encrypted credentials

    -- Timeout Settings
    search_timeout_ms INTEGER DEFAULT 30000,
    booking_timeout_ms INTEGER DEFAULT 60000,

    -- Contact Details (Actual)
    contact_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    support_email VARCHAR(100),
    support_phone VARCHAR(20),

    -- Masked Contact (for agents)
    mask_contact_details BOOLEAN DEFAULT false,
    masked_contact_name VARCHAR(100),
    masked_contact_email VARCHAR(100),
    masked_contact_phone VARCHAR(20),

    -- Commission from Supplier
    default_commission_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    default_commission_value DECIMAL(10,2) DEFAULT 0,

    -- Settings
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_test_mode BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, supplier_code)
);

-- Supplier Airline Configuration
CREATE TABLE supplier_airlines (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    airline_code VARCHAR(3) NOT NULL,
    airline_name VARCHAR(100),

    commission_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    commission_value DECIMAL(10,2) DEFAULT 0,
    plb_percentage DECIMAL(5,2) DEFAULT 0,

    instant_ticketing BOOLEAN DEFAULT true,
    is_enabled BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(supplier_id, airline_code)
);

-- =====================================================
-- 6. AGENTS (Enhanced)
-- =====================================================

CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),

    -- Login
    agent_code VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Type
    agent_type VARCHAR(20) DEFAULT 'INDIVIDUAL', -- INDIVIDUAL, COMPANY, SUB_AGENT, CORPORATE

    -- Company Info
    company_name VARCHAR(255),
    trade_name VARCHAR(255),
    contact_person VARCHAR(100),
    designation VARCHAR(100),

    -- Contact
    mobile VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    landline VARCHAR(20),
    whatsapp_number VARCHAR(20),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(50) DEFAULT 'India',

    -- KYC Documents
    pan_number VARCHAR(10),
    pan_document_url VARCHAR(500),
    gst_number VARCHAR(15),
    gst_document_url VARCHAR(500),
    aadhaar_number VARCHAR(12),
    aadhaar_document_url VARCHAR(500),
    business_registration_number VARCHAR(50),
    business_registration_doc_url VARCHAR(500),
    iata_number VARCHAR(20),

    -- Bank Details
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(30),
    bank_ifsc_code VARCHAR(15),
    bank_branch VARCHAR(100),
    cancelled_cheque_url VARCHAR(500),

    -- Assignment
    group_id INTEGER REFERENCES groups(id),
    scheme_id INTEGER REFERENCES schemes(id),
    parent_agent_id INTEGER REFERENCES agents(id),
    assigned_sales_person INTEGER,

    -- Financial
    credit_limit DECIMAL(15,2) DEFAULT 0,
    wallet_balance DECIMAL(15,2) DEFAULT 0,
    outstanding_amount DECIMAL(15,2) DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, SUSPENDED, BLOCKED
    status_reason TEXT,
    kyc_verified BOOLEAN DEFAULT false,
    kyc_verified_by INTEGER,
    kyc_verified_at TIMESTAMP,
    approved_by INTEGER,
    approved_at TIMESTAMP,

    -- Settings
    receive_whatsapp_notifications BOOLEAN DEFAULT true,
    receive_email_notifications BOOLEAN DEFAULT true,
    receive_sms_notifications BOOLEAN DEFAULT true,

    -- API Access
    api_access_enabled BOOLEAN DEFAULT false,
    api_key VARCHAR(100),
    api_secret_hash VARCHAR(255),
    api_rate_limit INTEGER DEFAULT 100,
    api_ip_whitelist JSONB DEFAULT '[]',

    -- Login Tracking
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(50),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, agent_code),
    UNIQUE(tenant_id, email)
);

-- =====================================================
-- 7. B2C CUSTOMERS
-- =====================================================

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),

    -- Account
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    mobile VARCHAR(20),

    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender CHAR(1),
    date_of_birth DATE,
    avatar_url VARCHAR(500),

    -- Address
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(50),
    pincode VARCHAR(10),

    -- Preferences
    preferred_currency VARCHAR(3) DEFAULT 'INR',
    preferred_language VARCHAR(5) DEFAULT 'en',

    -- Loyalty
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier VARCHAR(20) DEFAULT 'BRONZE', -- BRONZE, SILVER, GOLD, PLATINUM

    -- Social Login
    google_id VARCHAR(100),
    facebook_id VARCHAR(100),

    -- Settings
    marketing_consent BOOLEAN DEFAULT false,
    newsletter_subscribed BOOLEAN DEFAULT false,

    -- Status
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    mobile_verified BOOLEAN DEFAULT false,

    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Saved Travelers
CREATE TABLE saved_travelers (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,

    traveler_type VARCHAR(20) DEFAULT 'ADULT', -- ADULT, CHILD, INFANT
    title VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender CHAR(1),
    date_of_birth DATE,
    nationality VARCHAR(50),

    -- Documents
    passport_number VARCHAR(20),
    passport_expiry DATE,
    passport_country VARCHAR(50),

    -- Contact
    email VARCHAR(255),
    mobile VARCHAR(20),

    -- Preferences
    meal_preference VARCHAR(20),
    seat_preference VARCHAR(20),
    special_assistance TEXT,

    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 8. PAYMENT GATEWAYS
-- =====================================================

CREATE TABLE payment_gateways (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    gateway_name VARCHAR(50) NOT NULL,
    gateway_code VARCHAR(30) NOT NULL, -- RAZORPAY, PAYU, CCAVENUE, STRIPE, etc.

    -- Credentials (encrypted)
    credentials JSONB NOT NULL,

    -- Settings
    is_active BOOLEAN DEFAULT true,
    is_test_mode BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,

    -- Supported Methods
    supported_methods JSONB DEFAULT '["card", "netbanking", "upi", "wallet"]',

    -- Transaction Limits
    min_amount DECIMAL(15,2) DEFAULT 1,
    max_amount DECIMAL(15,2) DEFAULT 1000000,

    -- Charges
    gateway_charges_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    gateway_charges_value DECIMAL(10,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, gateway_code)
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    transaction_id VARCHAR(50) UNIQUE NOT NULL,

    -- Payer
    payer_type VARCHAR(20) NOT NULL, -- AGENT, CUSTOMER
    agent_id INTEGER REFERENCES agents(id),
    customer_id INTEGER REFERENCES customers(id),

    -- Gateway
    gateway_id INTEGER REFERENCES payment_gateways(id),
    gateway_transaction_id VARCHAR(100),
    gateway_order_id VARCHAR(100),

    -- Amount
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    gateway_charges DECIMAL(10,2) DEFAULT 0,

    -- Reference
    reference_type VARCHAR(30), -- BOOKING, WALLET_TOPUP, INVOICE
    reference_id VARCHAR(50),

    -- Status
    status VARCHAR(20) DEFAULT 'INITIATED', -- INITIATED, PROCESSING, SUCCESS, FAILED, REFUNDED
    failure_reason TEXT,

    -- Payment Method
    payment_method VARCHAR(30),
    card_last_four VARCHAR(4),
    bank_name VARCHAR(100),
    upi_id VARCHAR(100),

    -- Timestamps
    initiated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,

    -- Response
    gateway_response JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. WALLET & TRANSACTIONS
-- =====================================================

CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    transaction_id VARCHAR(50) UNIQUE NOT NULL,

    -- Account
    agent_id INTEGER REFERENCES agents(id),
    customer_id INTEGER REFERENCES customers(id),

    -- Transaction
    transaction_type VARCHAR(20) NOT NULL, -- CREDIT, DEBIT
    transaction_category VARCHAR(50) NOT NULL, -- TOPUP, BOOKING, CANCELLATION_REFUND, COMMISSION, ADJUSTMENT, TRANSFER

    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2),
    balance_after DECIMAL(15,2),

    -- Reference
    reference_type VARCHAR(50),
    reference_id VARCHAR(50),
    booking_id INTEGER,
    payment_transaction_id INTEGER REFERENCES payment_transactions(id),

    description TEXT,
    remarks TEXT,

    -- Approval
    requires_approval BOOLEAN DEFAULT false,
    approved_by INTEGER,
    approved_at TIMESTAMP,

    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 10. BOOKINGS (All Product Types)
-- =====================================================

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    booking_ref VARCHAR(20) UNIQUE NOT NULL,

    -- Product Type
    product_type VARCHAR(20) NOT NULL, -- FLIGHT, HOTEL, BUS, HOLIDAY, ACTIVITY, INSURANCE, VISA, TRANSFER

    -- Booker
    booker_type VARCHAR(20) NOT NULL, -- AGENT, CUSTOMER
    agent_id INTEGER REFERENCES agents(id),
    customer_id INTEGER REFERENCES customers(id),
    group_id INTEGER REFERENCES groups(id),
    scheme_id INTEGER REFERENCES schemes(id),

    -- Supplier
    supplier_id INTEGER REFERENCES suppliers(id),
    supplier_booking_ref VARCHAR(50),
    supplier_pnr VARCHAR(20),

    -- Contact
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_mobile VARCHAR(20),

    -- Travel Details (Common)
    travel_date DATE,
    return_date DATE,

    -- Passenger Counts
    adult_count INTEGER DEFAULT 1,
    child_count INTEGER DEFAULT 0,
    infant_count INTEGER DEFAULT 0,

    -- Financial - From Supplier
    supplier_base_fare DECIMAL(15,2) DEFAULT 0,
    supplier_taxes DECIMAL(15,2) DEFAULT 0,
    supplier_total DECIMAL(15,2) DEFAULT 0,
    supplier_commission DECIMAL(15,2) DEFAULT 0,
    supplier_tds DECIMAL(15,2) DEFAULT 0,

    -- Financial - Our Charges
    markup DECIMAL(15,2) DEFAULT 0,
    service_fee DECIMAL(15,2) DEFAULT 0,
    convenience_fee DECIMAL(15,2) DEFAULT 0,

    -- Financial - To Agent
    agent_commission DECIMAL(15,2) DEFAULT 0,
    agent_tds DECIMAL(15,2) DEFAULT 0,

    -- Financial - Final
    total_fare DECIMAL(15,2) DEFAULT 0,
    net_payable DECIMAL(15,2) DEFAULT 0,
    our_profit DECIMAL(15,2) DEFAULT 0,

    -- GST
    gst_amount DECIMAL(15,2) DEFAULT 0,
    cgst DECIMAL(15,2) DEFAULT 0,
    sgst DECIMAL(15,2) DEFAULT 0,
    igst DECIMAL(15,2) DEFAULT 0,

    -- Payment
    payment_status VARCHAR(20) DEFAULT 'UNPAID', -- UNPAID, PARTIAL, PAID, REFUNDED
    payment_mode VARCHAR(20), -- WALLET, CREDIT, GATEWAY
    paid_amount DECIMAL(15,2) DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, TICKETED, CANCELLED, FAILED, VOUCHERED
    status_reason TEXT,

    -- Cancellation
    cancellation_requested BOOLEAN DEFAULT false,
    cancellation_charges DECIMAL(15,2),
    refund_amount DECIMAL(15,2),
    refund_status VARCHAR(20),

    -- Timestamps
    booking_date TIMESTAMP DEFAULT NOW(),
    confirmation_date TIMESTAMP,
    ticketing_date TIMESTAMP,
    cancellation_date TIMESTAMP,

    -- Notifications
    confirmation_email_sent BOOLEAN DEFAULT false,
    confirmation_sms_sent BOOLEAN DEFAULT false,
    confirmation_whatsapp_sent BOOLEAN DEFAULT false,

    -- API Responses
    search_response JSONB,
    booking_response JSONB,
    ticket_response JSONB,
    cancel_response JSONB,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Booking Passengers/Guests
CREATE TABLE booking_passengers (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    pax_index INTEGER NOT NULL,
    pax_type VARCHAR(10) NOT NULL, -- ADULT, CHILD, INFANT

    title VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender CHAR(1),
    date_of_birth DATE,
    nationality VARCHAR(50),

    -- Documents
    passport_number VARCHAR(20),
    passport_expiry DATE,
    passport_country VARCHAR(50),

    -- Contact
    email VARCHAR(255),
    mobile VARCHAR(20),

    -- Ticket Info
    ticket_number VARCHAR(30),

    -- Fare Breakdown
    base_fare DECIMAL(15,2),
    taxes DECIMAL(15,2),
    total_fare DECIMAL(15,2),

    created_at TIMESTAMP DEFAULT NOW()
);

-- Flight Segments
CREATE TABLE booking_flight_segments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    segment_index INTEGER NOT NULL,
    leg_index INTEGER DEFAULT 0, -- 0=Onward, 1=Return

    airline_code VARCHAR(3),
    airline_name VARCHAR(100),
    flight_number VARCHAR(10),

    origin VARCHAR(3),
    origin_name VARCHAR(100),
    origin_terminal VARCHAR(10),

    destination VARCHAR(3),
    destination_name VARCHAR(100),
    destination_terminal VARCHAR(10),

    departure_datetime TIMESTAMP,
    arrival_datetime TIMESTAMP,
    duration_minutes INTEGER,

    aircraft_type VARCHAR(50),
    fare_class VARCHAR(10),
    fare_basis VARCHAR(20),
    cabin_class VARCHAR(20),

    baggage_allowance VARCHAR(50),
    meal_included BOOLEAN DEFAULT false,

    segment_status VARCHAR(20),

    created_at TIMESTAMP DEFAULT NOW()
);

-- Hotel Room Bookings
CREATE TABLE booking_hotel_rooms (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    room_index INTEGER NOT NULL,

    room_type VARCHAR(100),
    room_category VARCHAR(100),
    bed_type VARCHAR(50),

    check_in_date DATE,
    check_out_date DATE,
    nights INTEGER,

    adults INTEGER,
    children INTEGER,

    meal_plan VARCHAR(20), -- RO, BB, HB, FB, AI

    room_rate DECIMAL(15,2),
    total_rate DECIMAL(15,2),

    special_requests TEXT,
    confirmation_number VARCHAR(50),

    created_at TIMESTAMP DEFAULT NOW()
);

-- Bus Booking Details
CREATE TABLE booking_bus_details (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

    operator_name VARCHAR(100),
    bus_type VARCHAR(50),
    bus_number VARCHAR(20),

    origin_city VARCHAR(100),
    destination_city VARCHAR(100),

    boarding_point VARCHAR(200),
    boarding_time TIMESTAMP,

    dropping_point VARCHAR(200),
    dropping_time TIMESTAMP,

    seat_numbers TEXT,
    total_seats INTEGER,

    amenities JSONB,
    cancellation_policy TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 11. HOLIDAYS/PACKAGES
-- =====================================================

CREATE TABLE holiday_packages (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    package_code VARCHAR(30) UNIQUE NOT NULL,

    package_name VARCHAR(200) NOT NULL,
    destination VARCHAR(100),
    destinations JSONB, -- Multiple destinations

    -- Duration
    nights INTEGER NOT NULL,
    days INTEGER NOT NULL,

    -- Description
    short_description TEXT,
    long_description TEXT,
    highlights JSONB,

    -- Pricing
    starting_price DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'INR',
    price_per_person BOOLEAN DEFAULT true,

    -- Inclusions/Exclusions
    inclusions JSONB,
    exclusions JSONB,

    -- Itinerary
    itinerary JSONB, -- Array of day-wise activities

    -- Hotels
    hotel_category VARCHAR(20), -- 3STAR, 4STAR, 5STAR
    hotels JSONB,

    -- Flights
    flights_included BOOLEAN DEFAULT false,
    flight_details JSONB,

    -- Images
    main_image_url VARCHAR(500),
    gallery_urls JSONB,

    -- Policies
    cancellation_policy TEXT,
    payment_policy TEXT,
    terms_conditions TEXT,

    -- Availability
    valid_from DATE,
    valid_to DATE,
    blackout_dates JSONB,

    -- Categories
    category VARCHAR(50), -- HONEYMOON, FAMILY, ADVENTURE, PILGRIMAGE, etc.
    themes JSONB,

    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 12. ACTIVITIES
-- =====================================================

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    activity_code VARCHAR(30) UNIQUE NOT NULL,

    activity_name VARCHAR(200) NOT NULL,
    location VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),

    -- Description
    short_description TEXT,
    long_description TEXT,
    highlights JSONB,

    -- Duration
    duration_hours DECIMAL(5,2),
    duration_text VARCHAR(50),

    -- Pricing
    adult_price DECIMAL(15,2),
    child_price DECIMAL(15,2),
    infant_price DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'INR',

    -- Inclusions
    inclusions JSONB,
    exclusions JSONB,

    -- Time Slots
    time_slots JSONB,

    -- Images
    main_image_url VARCHAR(500),
    gallery_urls JSONB,

    -- Category
    category VARCHAR(50),
    subcategory VARCHAR(50),

    -- Policies
    cancellation_policy TEXT,
    terms_conditions TEXT,

    -- Availability
    available_days JSONB, -- [0,1,2,3,4,5,6]
    blackout_dates JSONB,

    is_instant_confirmation BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 13. INSURANCE
-- =====================================================

CREATE TABLE insurance_plans (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    supplier_id INTEGER REFERENCES suppliers(id),

    plan_code VARCHAR(30) NOT NULL,
    plan_name VARCHAR(200) NOT NULL,
    insurer_name VARCHAR(100),

    -- Coverage
    coverage_type VARCHAR(50), -- DOMESTIC, INTERNATIONAL, BOTH
    trip_type VARCHAR(30), -- SINGLE, MULTI_TRIP, ANNUAL

    -- Pricing
    base_premium DECIMAL(15,2),
    gst_percentage DECIMAL(5,2),

    -- Age Limits
    min_age INTEGER DEFAULT 0,
    max_age INTEGER DEFAULT 70,

    -- Coverage Amount
    sum_insured DECIMAL(15,2),

    -- Benefits
    benefits JSONB,

    -- Documents
    policy_wording_url VARCHAR(500),
    brochure_url VARCHAR(500),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 14. FINANCE MODULE
-- =====================================================

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    invoice_number VARCHAR(30) UNIQUE NOT NULL,
    invoice_type VARCHAR(20) NOT NULL, -- TAX_INVOICE, PROFORMA, CREDIT_NOTE, DEBIT_NOTE

    -- Party
    party_type VARCHAR(20) NOT NULL, -- AGENT, CUSTOMER
    agent_id INTEGER REFERENCES agents(id),
    customer_id INTEGER REFERENCES customers(id),

    -- Reference
    booking_id INTEGER REFERENCES bookings(id),

    -- Amounts
    subtotal DECIMAL(15,2) DEFAULT 0,
    discount DECIMAL(15,2) DEFAULT 0,
    taxable_amount DECIMAL(15,2) DEFAULT 0,
    cgst DECIMAL(15,2) DEFAULT 0,
    sgst DECIMAL(15,2) DEFAULT 0,
    igst DECIMAL(15,2) DEFAULT 0,
    total_tax DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,

    -- Payment
    paid_amount DECIMAL(15,2) DEFAULT 0,
    balance_amount DECIMAL(15,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'UNPAID',
    due_date DATE,

    -- GST Details
    place_of_supply VARCHAR(50),
    gst_treatment VARCHAR(30),

    -- Status
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, SENT, PAID, CANCELLED

    invoice_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

    description TEXT NOT NULL,
    hsn_sac_code VARCHAR(20),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(15,2),
    discount DECIMAL(15,2) DEFAULT 0,
    taxable_amount DECIMAL(15,2),
    gst_rate DECIMAL(5,2),
    gst_amount DECIMAL(15,2),
    total_amount DECIMAL(15,2),

    created_at TIMESTAMP DEFAULT NOW()
);

-- Ledger Entries
CREATE TABLE ledger_entries (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    entry_date DATE DEFAULT CURRENT_DATE,

    account_type VARCHAR(30) NOT NULL, -- AGENT, CUSTOMER, SUPPLIER, EXPENSE, INCOME
    account_id INTEGER,

    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,

    reference_type VARCHAR(30),
    reference_id INTEGER,

    narration TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 15. COMMUNICATION TEMPLATES
-- =====================================================

CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    template_code VARCHAR(50) NOT NULL,
    template_name VARCHAR(100) NOT NULL,

    -- Event
    event_type VARCHAR(50) NOT NULL, -- BOOKING_CONFIRMATION, TICKET_ISSUED, CANCELLATION, PAYMENT_RECEIPT, etc.
    product_type VARCHAR(20), -- NULL = All products

    -- Content
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,

    -- Placeholders (JSON array)
    available_placeholders JSONB,

    -- Attachments
    attach_ticket BOOLEAN DEFAULT true,
    attach_invoice BOOLEAN DEFAULT false,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, template_code)
);

CREATE TABLE sms_templates (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    template_code VARCHAR(50) NOT NULL,
    template_name VARCHAR(100) NOT NULL,

    event_type VARCHAR(50) NOT NULL,

    -- DLT Registration
    dlt_template_id VARCHAR(50),
    sender_id VARCHAR(10),

    message_template TEXT NOT NULL,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, template_code)
);

CREATE TABLE whatsapp_templates (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    template_code VARCHAR(50) NOT NULL,
    template_name VARCHAR(100) NOT NULL,

    event_type VARCHAR(50) NOT NULL,

    -- WhatsApp Business API
    wa_template_name VARCHAR(100),
    wa_template_namespace VARCHAR(100),

    -- Template
    header_type VARCHAR(20), -- TEXT, IMAGE, DOCUMENT, VIDEO
    header_content TEXT,
    body_template TEXT NOT NULL,
    footer_text VARCHAR(60),

    -- Buttons
    buttons JSONB,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, template_code)
);

-- Notification Logs
CREATE TABLE notification_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),

    channel VARCHAR(20) NOT NULL, -- EMAIL, SMS, WHATSAPP, PUSH
    template_id INTEGER,

    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT,

    -- Reference
    reference_type VARCHAR(30),
    reference_id INTEGER,

    -- Attachments
    attachments JSONB,

    -- Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SENT, DELIVERED, FAILED
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    error_message TEXT,

    -- Provider Response
    provider_message_id VARCHAR(100),
    provider_response JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 16. API KEYS MANAGEMENT
-- =====================================================

CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    agent_id INTEGER REFERENCES agents(id),

    key_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    api_secret_hash VARCHAR(255) NOT NULL,

    -- Permissions
    scopes JSONB DEFAULT '["read"]', -- read, write, booking, etc.

    -- Security
    ip_whitelist JSONB DEFAULT '[]',
    rate_limit_per_minute INTEGER DEFAULT 60,

    -- Usage
    last_used_at TIMESTAMP,
    total_requests BIGINT DEFAULT 0,

    -- Status
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- API Request Logs
CREATE TABLE api_request_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    api_key_id INTEGER REFERENCES api_keys(id),

    endpoint VARCHAR(200),
    method VARCHAR(10),
    request_body JSONB,
    response_status INTEGER,
    response_time_ms INTEGER,

    ip_address VARCHAR(50),
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 17. FARE CALENDAR
-- =====================================================

CREATE TABLE fare_calendar (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),

    -- Route
    origin VARCHAR(3) NOT NULL,
    destination VARCHAR(3) NOT NULL,

    -- Date
    travel_date DATE NOT NULL,

    -- Fares
    min_fare DECIMAL(15,2),
    max_fare DECIMAL(15,2),
    avg_fare DECIMAL(15,2),

    -- Airlines
    cheapest_airline VARCHAR(3),
    airlines_available JSONB,

    -- Metadata
    fare_updated_at TIMESTAMP,
    search_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, origin, destination, travel_date)
);

-- =====================================================
-- 18. AI FEATURES
-- =====================================================

CREATE TABLE ai_chat_sessions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),

    session_id VARCHAR(50) UNIQUE NOT NULL,

    -- User
    user_type VARCHAR(20), -- AGENT, CUSTOMER, GUEST
    agent_id INTEGER REFERENCES agents(id),
    customer_id INTEGER REFERENCES customers(id),

    -- Context
    context JSONB,

    -- Status
    status VARCHAR(20) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL, -- USER, ASSISTANT, SYSTEM
    content TEXT NOT NULL,

    -- Metadata
    intent VARCHAR(50),
    entities JSONB,
    confidence DECIMAL(5,4),

    -- Actions taken
    actions JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 19. REPORTS & ANALYTICS
-- =====================================================

CREATE TABLE saved_reports (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),

    report_name VARCHAR(100) NOT NULL,
    report_type VARCHAR(50) NOT NULL,

    -- Filters
    filters JSONB,

    -- Columns
    columns JSONB,

    -- Schedule
    is_scheduled BOOLEAN DEFAULT false,
    schedule_frequency VARCHAR(20), -- DAILY, WEEKLY, MONTHLY
    schedule_time TIME,
    schedule_recipients JSONB,

    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pre-aggregated Analytics (for dashboards)
CREATE TABLE analytics_daily (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    report_date DATE NOT NULL,

    -- Bookings
    total_bookings INTEGER DEFAULT 0,
    flight_bookings INTEGER DEFAULT 0,
    hotel_bookings INTEGER DEFAULT 0,
    bus_bookings INTEGER DEFAULT 0,
    holiday_bookings INTEGER DEFAULT 0,

    -- Revenue
    total_revenue DECIMAL(15,2) DEFAULT 0,
    flight_revenue DECIMAL(15,2) DEFAULT 0,
    hotel_revenue DECIMAL(15,2) DEFAULT 0,
    bus_revenue DECIMAL(15,2) DEFAULT 0,

    -- Profit
    total_profit DECIMAL(15,2) DEFAULT 0,
    total_commission DECIMAL(15,2) DEFAULT 0,

    -- Cancellations
    cancellations INTEGER DEFAULT 0,
    refund_amount DECIMAL(15,2) DEFAULT 0,

    -- Agents
    active_agents INTEGER DEFAULT 0,
    new_agents INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, report_date)
);

-- =====================================================
-- 20. AUDIT LOGS
-- =====================================================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),

    -- Who
    user_type VARCHAR(20), -- ADMIN, AGENT, CUSTOMER, SYSTEM
    user_id INTEGER,
    user_email VARCHAR(255),

    -- What
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,

    -- Details
    old_values JSONB,
    new_values JSONB,
    description TEXT,

    -- Context
    ip_address VARCHAR(50),
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_bookings_agent ON bookings(agent_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_product ON bookings(product_type);

CREATE INDEX idx_agents_tenant ON agents(tenant_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_group ON agents(group_id);

CREATE INDEX idx_wallet_agent ON wallet_transactions(agent_id);
CREATE INDEX idx_wallet_date ON wallet_transactions(created_at);

CREATE INDEX idx_payments_tenant ON payment_transactions(tenant_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

CREATE INDEX idx_fare_calendar_route ON fare_calendar(origin, destination);
CREATE INDEX idx_fare_calendar_date ON fare_calendar(travel_date);
