-- =====================================================
-- B2B TRAVEL PORTAL - COMPLETE DATABASE SCHEMA
-- Based on Flyshop Admin Panel Architecture
-- =====================================================

-- =====================================================
-- CORE TABLES: GROUPS, SCHEMES, AGENTS
-- =====================================================

-- Groups: Container for agents with shared settings
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL UNIQUE,
    group_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    parent_group_id INTEGER REFERENCES groups(id),
    default_scheme_id INTEGER, -- Will reference schemes table
    credit_limit DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Schemes: Commission/markup rules applied to groups
CREATE TABLE schemes (
    id SERIAL PRIMARY KEY,
    scheme_name VARCHAR(100) NOT NULL UNIQUE,
    scheme_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    
    -- Domestic Flight Settings
    domestic_service_fee_type VARCHAR(20) DEFAULT 'FLAT', -- FLAT, PERCENTAGE
    domestic_service_fee_value DECIMAL(10,2) DEFAULT 0,
    domestic_markup_on_base DECIMAL(10,2) DEFAULT 0, -- Percentage on base fare
    domestic_commission_share DECIMAL(5,2) DEFAULT 0, -- % of commission to share with agent
    
    -- International Flight Settings
    intl_service_fee_type VARCHAR(20) DEFAULT 'FLAT',
    intl_service_fee_value DECIMAL(10,2) DEFAULT 0,
    intl_markup_on_base DECIMAL(10,2) DEFAULT 0,
    intl_commission_share DECIMAL(5,2) DEFAULT 0,
    
    -- Tax Settings
    apply_gst BOOLEAN DEFAULT true,
    gst_rate DECIMAL(5,2) DEFAULT 18.00,
    apply_tds BOOLEAN DEFAULT true,
    tds_rate DECIMAL(5,2) DEFAULT 2.00,
    
    -- General Settings
    allow_credit BOOLEAN DEFAULT false,
    max_credit_limit DECIMAL(15,2) DEFAULT 0,
    auto_ticket BOOLEAN DEFAULT false, -- Auto issue ticket after payment
    block_ticket_allowed BOOLEAN DEFAULT true,
    block_ticket_duration_hours INTEGER DEFAULT 24,
    
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Update groups table to reference schemes
ALTER TABLE groups ADD CONSTRAINT fk_groups_scheme 
    FOREIGN KEY (default_scheme_id) REFERENCES schemes(id);

-- Scheme API Configuration: Which APIs are enabled per scheme
CREATE TABLE scheme_api_config (
    id SERIAL PRIMARY KEY,
    scheme_id INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    api_provider_id INTEGER NOT NULL REFERENCES api_providers(id),
    is_enabled BOOLEAN DEFAULT true,
    
    -- Override scheme-level settings for this specific API
    override_service_fee BOOLEAN DEFAULT false,
    custom_service_fee_type VARCHAR(20),
    custom_service_fee_value DECIMAL(10,2),
    custom_markup_on_base DECIMAL(10,2),
    custom_commission_share DECIMAL(5,2),
    
    -- API-specific airline restrictions
    allowed_airlines TEXT, -- Comma-separated airline codes, empty = all
    blocked_airlines TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scheme Airline Rules: Specific rules per airline within a scheme
CREATE TABLE scheme_airline_rules (
    id SERIAL PRIMARY KEY,
    scheme_id INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    airline_code VARCHAR(3) NOT NULL,
    
    -- Travel Type (0=DOMESTIC, 1=INTERNATIONAL, 2=BOTH)
    travel_type SMALLINT DEFAULT 2,
    
    -- Fare Class specific rules
    fare_class VARCHAR(10), -- NULL = all classes
    
    -- Commission/Markup overrides
    service_fee_type VARCHAR(20),
    service_fee_value DECIMAL(10,2),
    markup_on_base DECIMAL(10,2),
    commission_share DECIMAL(5,2),
    
    -- Enable/Disable
    is_enabled BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(scheme_id, airline_code, fare_class)
);

-- =====================================================
-- API PROVIDERS CONFIGURATION
-- =====================================================

CREATE TABLE api_providers (
    id SERIAL PRIMARY KEY,
    provider_name VARCHAR(100) NOT NULL,
    provider_code VARCHAR(20) NOT NULL UNIQUE,
    provider_type VARCHAR(50), -- GDS, LCC_DIRECT, CONSOLIDATOR
    
    -- API Credentials (encrypted in production)
    api_base_url VARCHAR(500),
    api_user_id VARCHAR(100),
    api_password VARCHAR(255),
    api_key VARCHAR(255),
    
    -- Contact Details
    contact_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    support_email VARCHAR(100),
    support_phone VARCHAR(20),
    
    -- Masking Settings
    mask_contact_details BOOLEAN DEFAULT false,
    masked_contact_name VARCHAR(100),
    masked_contact_email VARCHAR(100),
    masked_contact_phone VARCHAR(20),
    
    -- Commission Structure from provider
    base_commission_domestic DECIMAL(5,2) DEFAULT 0,
    base_commission_intl DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_test_mode BOOLEAN DEFAULT false,
    
    -- Operational settings
    search_timeout_seconds INTEGER DEFAULT 30,
    booking_timeout_seconds INTEGER DEFAULT 60,
    max_retry_attempts INTEGER DEFAULT 3,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- API Provider Airline Config
CREATE TABLE api_provider_airlines (
    id SERIAL PRIMARY KEY,
    api_provider_id INTEGER NOT NULL REFERENCES api_providers(id) ON DELETE CASCADE,
    airline_code VARCHAR(3) NOT NULL,
    airline_name VARCHAR(100),
    
    -- Commission from this provider for this airline
    commission_type VARCHAR(20) DEFAULT 'PERCENTAGE', -- FLAT, PERCENTAGE
    commission_value DECIMAL(10,2) DEFAULT 0,
    
    -- PLB (Performance Linked Bonus) if applicable
    plb_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Fare Classes available
    available_classes TEXT, -- JSON array of class codes
    
    -- Settings
    is_enabled BOOLEAN DEFAULT true,
    instant_ticketing BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(api_provider_id, airline_code)
);

-- API Provider Fare Type Commission
CREATE TABLE api_provider_fare_commissions (
    id SERIAL PRIMARY KEY,
    api_provider_id INTEGER NOT NULL REFERENCES api_providers(id) ON DELETE CASCADE,
    airline_code VARCHAR(3),
    fare_type VARCHAR(50), -- PUBLISHED, SERIES, SME, CORPORATE, STUDENT, etc.
    fare_class VARCHAR(10),
    travel_type SMALLINT DEFAULT 0, -- 0=DOMESTIC, 1=INTERNATIONAL
    
    -- Commission details
    commission_type VARCHAR(20) DEFAULT 'PERCENTAGE',
    commission_value DECIMAL(10,2),
    
    -- Effective dates
    effective_from DATE,
    effective_to DATE,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- AGENTS TABLE (Enhanced)
-- =====================================================

CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    
    -- Login Credentials
    agent_code VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Personal/Company Info
    agent_type VARCHAR(20) DEFAULT 'INDIVIDUAL', -- INDIVIDUAL, COMPANY, SUB_AGENT
    company_name VARCHAR(255),
    contact_person VARCHAR(100),
    
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
    
    -- Business Documents
    business_registration_number VARCHAR(50),
    business_registration_doc_url VARCHAR(500),
    cancelled_cheque_url VARCHAR(500),
    
    -- Bank Details
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(30),
    bank_ifsc_code VARCHAR(15),
    bank_branch VARCHAR(100),
    
    -- Group & Scheme Assignment
    group_id INTEGER REFERENCES groups(id),
    scheme_id INTEGER REFERENCES schemes(id), -- Override group's default scheme
    
    -- Parent Agent (for sub-agents)
    parent_agent_id INTEGER REFERENCES agents(id),
    
    -- Financial
    credit_limit DECIMAL(15,2) DEFAULT 0,
    wallet_balance DECIMAL(15,2) DEFAULT 0,
    outstanding_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, SUSPENDED, BLOCKED
    status_reason TEXT,
    
    -- Approval workflow
    kyc_verified BOOLEAN DEFAULT false,
    kyc_verified_by INTEGER,
    kyc_verified_at TIMESTAMP,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    
    -- Settings
    receive_whatsapp_notifications BOOLEAN DEFAULT true,
    receive_email_notifications BOOLEAN DEFAULT true,
    receive_sms_notifications BOOLEAN DEFAULT true,
    
    -- API Access (if agent has direct API access)
    api_access_enabled BOOLEAN DEFAULT false,
    api_user_id VARCHAR(100),
    api_password_hash VARCHAR(255),
    
    -- Login tracking
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(50),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent Group History (track group changes)
CREATE TABLE agent_group_history (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    old_group_id INTEGER REFERENCES groups(id),
    new_group_id INTEGER REFERENCES groups(id),
    old_scheme_id INTEGER REFERENCES schemes(id),
    new_scheme_id INTEGER REFERENCES schemes(id),
    changed_by INTEGER,
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- AGENT SIGNUP REQUESTS (Self-registration)
-- =====================================================

CREATE TABLE agent_signup_requests (
    id SERIAL PRIMARY KEY,
    
    -- Basic Info
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    
    -- Address
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    
    -- KYC Documents
    pan_number VARCHAR(10),
    pan_document_url VARCHAR(500),
    gst_number VARCHAR(15),
    gst_document_url VARCHAR(500),
    aadhaar_number VARCHAR(12),
    aadhaar_document_url VARCHAR(500),
    business_registration_doc_url VARCHAR(500),
    
    -- Request Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, UNDER_REVIEW, APPROVED, REJECTED
    status_reason TEXT,
    
    -- Processing
    reviewed_by INTEGER,
    reviewed_at TIMESTAMP,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    created_agent_id INTEGER REFERENCES agents(id),
    
    -- Auto-assign on approval
    assign_to_group_id INTEGER REFERENCES groups(id),
    assign_scheme_id INTEGER REFERENCES schemes(id),
    
    -- Metadata
    ip_address VARCHAR(50),
    user_agent TEXT,
    referral_code VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TAX CONFIGURATION
-- =====================================================

CREATE TABLE tax_configurations (
    id SERIAL PRIMARY KEY,
    tax_name VARCHAR(50) NOT NULL,
    tax_code VARCHAR(20) NOT NULL,
    
    -- Applicability
    applies_to VARCHAR(20) DEFAULT 'ALL', -- ALL, GROUP, AGENT
    group_id INTEGER REFERENCES groups(id),
    agent_id INTEGER REFERENCES agents(id),
    
    -- Tax Settings
    tax_type VARCHAR(20) DEFAULT 'PERCENTAGE', -- PERCENTAGE, FLAT
    tax_value DECIMAL(10,2) NOT NULL,
    
    -- Conditions
    apply_on VARCHAR(50), -- BASE_FARE, SERVICE_FEE, TOTAL, COMMISSION
    min_amount DECIMAL(15,2), -- Minimum amount for tax to apply
    max_amount DECIMAL(15,2), -- Maximum tax cap
    
    -- Travel Type
    travel_type SMALLINT DEFAULT 2, -- 0=DOMESTIC, 1=INTL, 2=BOTH
    
    is_active BOOLEAN DEFAULT true,
    effective_from DATE,
    effective_to DATE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- BOOKINGS (Enhanced with scheme/commission tracking)
-- =====================================================

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_ref_no VARCHAR(20) UNIQUE NOT NULL,
    
    -- Agent Info
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    agent_code VARCHAR(20),
    group_id INTEGER REFERENCES groups(id),
    scheme_id INTEGER REFERENCES schemes(id),
    
    -- API Provider used
    api_provider_id INTEGER REFERENCES api_providers(id),
    
    -- Flight Info
    airline_pnr VARCHAR(20),
    supplier_ref_no VARCHAR(50),
    travel_type SMALLINT, -- 0=DOMESTIC, 1=INTERNATIONAL
    booking_type SMALLINT, -- 0=ONEWAY, 1=ROUNDTRIP
    
    -- Passenger counts
    adult_count INTEGER DEFAULT 1,
    child_count INTEGER DEFAULT 0,
    infant_count INTEGER DEFAULT 0,
    
    -- Financial Breakdown
    base_fare DECIMAL(15,2) DEFAULT 0,
    taxes DECIMAL(15,2) DEFAULT 0,
    
    -- From API Provider
    api_commission DECIMAL(15,2) DEFAULT 0,
    api_plb DECIMAL(15,2) DEFAULT 0,
    api_tds DECIMAL(15,2) DEFAULT 0,
    
    -- Our charges to agent
    service_fee DECIMAL(15,2) DEFAULT 0,
    markup DECIMAL(15,2) DEFAULT 0,
    
    -- Commission shared with agent
    agent_commission DECIMAL(15,2) DEFAULT 0,
    agent_tds DECIMAL(15,2) DEFAULT 0,
    agent_gst_on_commission DECIMAL(15,2) DEFAULT 0,
    
    -- Final amounts
    gross_amount DECIMAL(15,2) DEFAULT 0, -- What customer pays
    net_amount DECIMAL(15,2) DEFAULT 0, -- What agent pays us
    our_profit DECIMAL(15,2) DEFAULT 0, -- Our margin
    
    -- Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, TICKETED, CANCELLED, FAILED
    ticket_status VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'UNPAID',
    
    -- Timestamps
    booking_date TIMESTAMP DEFAULT NOW(),
    ticketing_date TIMESTAMP,
    cancellation_date TIMESTAMP,
    
    -- Contact
    pax_mobile VARCHAR(20),
    pax_email VARCHAR(255),
    
    -- Notifications sent
    whatsapp_sent BOOLEAN DEFAULT false,
    whatsapp_sent_at TIMESTAMP,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP,
    sms_sent BOOLEAN DEFAULT false,
    sms_sent_at TIMESTAMP,
    
    -- Raw API responses (for debugging)
    search_response JSONB,
    booking_response JSONB,
    ticket_response JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Booking Passengers
CREATE TABLE booking_passengers (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    pax_id INTEGER NOT NULL,
    pax_type SMALLINT, -- 0=ADT, 1=CHD, 2=INF
    title VARCHAR(10),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender CHAR(1),
    dob DATE,
    ticket_number VARCHAR(20),
    seat_number VARCHAR(10),
    
    -- Fare for this passenger
    base_fare DECIMAL(10,2),
    taxes DECIMAL(10,2),
    total_fare DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Booking Segments
CREATE TABLE booking_segments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    segment_id INTEGER,
    leg_index INTEGER,
    
    airline_code VARCHAR(3),
    flight_number VARCHAR(10),
    origin VARCHAR(3),
    destination VARCHAR(3),
    departure_datetime TIMESTAMP,
    arrival_datetime TIMESTAMP,
    duration VARCHAR(10),
    
    fare_class VARCHAR(10),
    fare_basis VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- WALLET & TRANSACTIONS
-- =====================================================

CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER NOT NULL REFERENCES agents(id),
    
    transaction_type VARCHAR(20) NOT NULL, -- CREDIT, DEBIT
    transaction_category VARCHAR(50), -- TOPUP, BOOKING, CANCELLATION_REFUND, COMMISSION, ADJUSTMENT
    
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    
    -- Reference
    reference_type VARCHAR(50), -- BOOKING, BANK_TRANSFER, MANUAL
    reference_id VARCHAR(50),
    booking_id INTEGER REFERENCES bookings(id),
    
    description TEXT,
    remarks TEXT,
    
    -- Approval (for manual adjustments)
    requires_approval BOOLEAN DEFAULT false,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE notification_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    template_code VARCHAR(50) NOT NULL UNIQUE,
    
    notification_type VARCHAR(20), -- WHATSAPP, EMAIL, SMS
    event_type VARCHAR(50), -- BOOKING_CONFIRMED, TICKET_ISSUED, CANCELLATION, etc.
    
    subject VARCHAR(255), -- For email
    body_template TEXT NOT NULL, -- Template with placeholders
    
    -- Placeholders: {{agent_name}}, {{pnr}}, {{passenger_name}}, {{flight_details}}, etc.
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notification_logs (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(id),
    booking_id INTEGER REFERENCES bookings(id),
    
    notification_type VARCHAR(20), -- WHATSAPP, EMAIL, SMS
    recipient VARCHAR(255),
    
    template_id INTEGER REFERENCES notification_templates(id),
    subject VARCHAR(255),
    body TEXT,
    
    -- Attachments
    has_attachment BOOLEAN DEFAULT false,
    attachment_type VARCHAR(50), -- TICKET_PDF, INVOICE_PDF
    attachment_url VARCHAR(500),
    
    -- Delivery status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SENT, DELIVERED, FAILED
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    failed_reason TEXT,
    
    -- Provider response
    provider_message_id VARCHAR(100),
    provider_response JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ADMIN USERS
-- =====================================================

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    full_name VARCHAR(100),
    mobile VARCHAR(20),
    
    role VARCHAR(50) DEFAULT 'STAFF', -- SUPER_ADMIN, ADMIN, MANAGER, STAFF
    
    -- Permissions (JSON array of permission codes)
    permissions JSONB DEFAULT '[]',
    
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Permissions
CREATE TABLE admin_permissions (
    id SERIAL PRIMARY KEY,
    permission_code VARCHAR(50) UNIQUE NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    permission_group VARCHAR(50), -- AGENTS, BOOKINGS, SCHEMES, REPORTS, etc.
    description TEXT
);

-- Insert default permissions
INSERT INTO admin_permissions (permission_code, permission_name, permission_group) VALUES
('agents.view', 'View Agents', 'AGENTS'),
('agents.create', 'Create Agents', 'AGENTS'),
('agents.edit', 'Edit Agents', 'AGENTS'),
('agents.approve', 'Approve Agent Signups', 'AGENTS'),
('agents.block', 'Block/Unblock Agents', 'AGENTS'),
('groups.view', 'View Groups', 'GROUPS'),
('groups.create', 'Create Groups', 'GROUPS'),
('groups.edit', 'Edit Groups', 'GROUPS'),
('schemes.view', 'View Schemes', 'SCHEMES'),
('schemes.create', 'Create Schemes', 'SCHEMES'),
('schemes.edit', 'Edit Schemes', 'SCHEMES'),
('apis.view', 'View API Providers', 'APIS'),
('apis.create', 'Create API Providers', 'APIS'),
('apis.edit', 'Edit API Providers', 'APIS'),
('bookings.view', 'View Bookings', 'BOOKINGS'),
('bookings.cancel', 'Cancel Bookings', 'BOOKINGS'),
('wallet.view', 'View Wallet', 'WALLET'),
('wallet.credit', 'Credit Wallet', 'WALLET'),
('wallet.debit', 'Debit Wallet', 'WALLET'),
('reports.view', 'View Reports', 'REPORTS'),
('reports.export', 'Export Reports', 'REPORTS'),
('settings.view', 'View Settings', 'SETTINGS'),
('settings.edit', 'Edit Settings', 'SETTINGS');

-- =====================================================
-- AUDIT LOG
-- =====================================================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    
    -- Who
    user_type VARCHAR(20), -- ADMIN, AGENT
    user_id INTEGER,
    user_email VARCHAR(255),
    
    -- What
    action VARCHAR(50), -- CREATE, UPDATE, DELETE, LOGIN, APPROVE, etc.
    entity_type VARCHAR(50), -- AGENT, BOOKING, SCHEME, etc.
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

CREATE INDEX idx_agents_group ON agents(group_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_email ON agents(email);
CREATE INDEX idx_bookings_agent ON bookings(agent_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_wallet_agent ON wallet_transactions(agent_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
