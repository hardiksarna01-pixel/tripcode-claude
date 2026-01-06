-- =====================================================
-- AIRLINE & CLASS-LEVEL COMMISSION SYSTEM
-- Granular commission partitioning by airline, class, route
-- =====================================================

-- =====================================================
-- 1. AIRLINE COMMISSION SLABS (Master)
-- Different commission rates per airline
-- =====================================================

CREATE TABLE airline_commission_master (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    supplier_id INTEGER REFERENCES suppliers(id),

    -- Airline Info
    airline_code VARCHAR(3) NOT NULL,          -- 6E, AI, UK, SG, etc.
    airline_name VARCHAR(100),

    -- Default Commission (fallback)
    default_commission_type VARCHAR(20) DEFAULT 'PERCENTAGE', -- PERCENTAGE, FLAT, PER_PAX
    default_commission_value DECIMAL(10,2) DEFAULT 0,

    -- PLB (Productivity Linked Bonus)
    plb_enabled BOOLEAN DEFAULT false,
    plb_percentage DECIMAL(5,2) DEFAULT 0,
    plb_threshold_bookings INTEGER,            -- Min bookings to qualify
    plb_threshold_revenue DECIMAL(15,2),       -- Min revenue to qualify

    -- Incentive Slabs (based on volume)
    incentive_slabs JSONB DEFAULT '[]',        -- [{min: 0, max: 50, bonus: 0.5}, {min: 51, max: 100, bonus: 1.0}]

    -- Route-level Override Flag
    has_route_rules BOOLEAN DEFAULT false,

    -- Class-level Override Flag
    has_class_rules BOOLEAN DEFAULT false,

    -- Validity
    valid_from DATE,
    valid_to DATE,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, supplier_id, airline_code)
);

-- =====================================================
-- 2. CLASS OF SERVICE COMMISSION RULES
-- Commission by cabin class and fare class
-- =====================================================

CREATE TABLE class_commission_rules (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    airline_commission_id INTEGER REFERENCES airline_commission_master(id) ON DELETE CASCADE,

    -- Airline (denormalized for query performance)
    airline_code VARCHAR(3) NOT NULL,

    -- Cabin Class
    cabin_class VARCHAR(20) NOT NULL,          -- ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST

    -- Fare Classes (RBD - Reservation Booking Designator)
    fare_classes VARCHAR(50),                  -- Comma-separated: Y,B,M,H,K,L,Q,T,N,R,X,G,V,W
                                               -- NULL = All classes in this cabin

    -- Commission Structure
    commission_type VARCHAR(20) NOT NULL,      -- PERCENTAGE, FLAT, PER_PAX
    commission_value DECIMAL(10,2) NOT NULL,

    -- Additional YQ/YR Commission (fuel surcharge commission)
    yq_commission_type VARCHAR(20),
    yq_commission_value DECIMAL(10,2) DEFAULT 0,

    -- Conditions
    min_fare DECIMAL(15,2),                    -- Minimum fare to apply
    max_fare DECIMAL(15,2),                    -- Maximum fare to apply

    -- Travel Type
    travel_type VARCHAR(20),                   -- DOMESTIC, INTERNATIONAL, NULL = Both

    -- Validity
    valid_from DATE,
    valid_to DATE,

    -- Priority (higher = checked first)
    priority INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, airline_code, cabin_class, fare_classes, travel_type)
);

-- =====================================================
-- 3. ROUTE-SPECIFIC COMMISSION RULES
-- Override commission for specific routes
-- =====================================================

CREATE TABLE route_commission_rules (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    airline_commission_id INTEGER REFERENCES airline_commission_master(id) ON DELETE CASCADE,

    -- Airline
    airline_code VARCHAR(3) NOT NULL,

    -- Route
    origin VARCHAR(3),                         -- NULL = Any origin
    destination VARCHAR(3),                    -- NULL = Any destination
    via VARCHAR(3),                            -- For connecting flights

    -- Travel Type
    travel_type VARCHAR(20),                   -- DOMESTIC, INTERNATIONAL

    -- Cabin/Class (optional - for route + class combo)
    cabin_class VARCHAR(20),
    fare_classes VARCHAR(50),

    -- Commission
    commission_type VARCHAR(20) NOT NULL,
    commission_value DECIMAL(10,2) NOT NULL,

    -- YQ/YR Commission
    yq_commission_type VARCHAR(20),
    yq_commission_value DECIMAL(10,2) DEFAULT 0,

    -- Date Range
    travel_date_from DATE,
    travel_date_to DATE,
    booking_date_from DATE,
    booking_date_to DATE,

    -- Priority
    priority INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. SPECIAL/PROMOTIONAL COMMISSION DEALS
-- Time-limited commission boosts
-- =====================================================

CREATE TABLE special_commission_deals (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),

    deal_name VARCHAR(100) NOT NULL,
    deal_code VARCHAR(30) UNIQUE,

    -- Applicability
    airline_codes JSONB,                       -- ['6E', 'AI'] or NULL for all
    cabin_classes JSONB,                       -- ['ECONOMY', 'BUSINESS'] or NULL for all
    fare_classes JSONB,                        -- ['Y', 'B', 'M'] or NULL for all
    routes JSONB,                              -- [{origin: 'DEL', destination: 'BOM'}] or NULL

    -- Commission Boost
    boost_type VARCHAR(20) NOT NULL,           -- ADDITIONAL_PERCENTAGE, ADDITIONAL_FLAT, OVERRIDE
    boost_value DECIMAL(10,2) NOT NULL,

    -- Targets (optional)
    target_bookings INTEGER,                   -- Target number of bookings
    target_revenue DECIMAL(15,2),              -- Target revenue

    -- Validity
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Days of Week (optional)
    applicable_days JSONB,                     -- [1,2,3,4,5] Mon-Fri

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. AGENT-SPECIFIC COMMISSION OVERRIDES
-- Custom commission for specific agents
-- =====================================================

CREATE TABLE agent_commission_overrides (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,

    -- Scope
    airline_code VARCHAR(3),                   -- NULL = All airlines
    cabin_class VARCHAR(20),                   -- NULL = All classes
    travel_type VARCHAR(20),                   -- DOMESTIC, INTERNATIONAL, NULL = Both

    -- Commission Share (% of supplier commission given to agent)
    commission_share_percentage DECIMAL(5,2) NOT NULL,

    -- Or Fixed Commission
    fixed_commission_type VARCHAR(20),
    fixed_commission_value DECIMAL(10,2),

    -- Validity
    valid_from DATE,
    valid_to DATE,

    reason TEXT,                               -- Why override was given
    approved_by INTEGER,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. COMMISSION CALCULATION LOG
-- Audit trail of commission calculations
-- =====================================================

CREATE TABLE commission_calculation_log (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    booking_id INTEGER REFERENCES bookings(id),

    -- Flight Details
    airline_code VARCHAR(3),
    flight_number VARCHAR(10),
    origin VARCHAR(3),
    destination VARCHAR(3),
    cabin_class VARCHAR(20),
    fare_class VARCHAR(5),
    travel_type VARCHAR(20),

    -- Fare Breakdown
    base_fare DECIMAL(15,2),
    yq_amount DECIMAL(15,2),                   -- Fuel surcharge
    yr_amount DECIMAL(15,2),                   -- Other carrier surcharge
    taxes DECIMAL(15,2),
    total_fare DECIMAL(15,2),

    -- Commission Calculation
    rule_applied VARCHAR(50),                  -- Which rule was used
    rule_id INTEGER,

    base_fare_commission DECIMAL(15,2),
    yq_commission DECIMAL(15,2),
    total_supplier_commission DECIMAL(15,2),

    -- PLB/Incentive
    plb_applicable BOOLEAN DEFAULT false,
    plb_amount DECIMAL(15,2) DEFAULT 0,
    incentive_amount DECIMAL(15,2) DEFAULT 0,
    special_deal_amount DECIMAL(15,2) DEFAULT 0,

    -- Agent Share
    agent_share_percentage DECIMAL(5,2),
    agent_commission DECIMAL(15,2),

    -- Net
    platform_commission DECIMAL(15,2),

    calculated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_airline_comm_tenant ON airline_commission_master(tenant_id);
CREATE INDEX idx_airline_comm_airline ON airline_commission_master(airline_code);
CREATE INDEX idx_airline_comm_supplier ON airline_commission_master(supplier_id);

CREATE INDEX idx_class_comm_airline ON class_commission_rules(airline_code);
CREATE INDEX idx_class_comm_cabin ON class_commission_rules(cabin_class);
CREATE INDEX idx_class_comm_tenant ON class_commission_rules(tenant_id);

CREATE INDEX idx_route_comm_airline ON route_commission_rules(airline_code);
CREATE INDEX idx_route_comm_route ON route_commission_rules(origin, destination);

CREATE INDEX idx_agent_override_agent ON agent_commission_overrides(agent_id);

CREATE INDEX idx_comm_log_booking ON commission_calculation_log(booking_id);
CREATE INDEX idx_comm_log_airline ON commission_calculation_log(airline_code);

-- =====================================================
-- SAMPLE DATA: Indian Airlines Commission Structure
-- =====================================================

-- IndiGo (6E) - Sample Commission
INSERT INTO airline_commission_master (tenant_id, supplier_id, airline_code, airline_name,
    default_commission_type, default_commission_value, plb_enabled, plb_percentage, has_class_rules)
VALUES
(1, 1, '6E', 'IndiGo', 'PERCENTAGE', 5.0, true, 1.0, true);

-- IndiGo Class-wise Commission
INSERT INTO class_commission_rules (tenant_id, airline_commission_id, airline_code, cabin_class,
    fare_classes, commission_type, commission_value, travel_type)
VALUES
-- Economy Full Fares (Higher Commission)
(1, 1, '6E', 'ECONOMY', 'Y,B,M,H,K', 'PERCENTAGE', 7.0, 'DOMESTIC'),
-- Economy Discounted Fares (Lower Commission)
(1, 1, '6E', 'ECONOMY', 'L,Q,T,N,R,X,G,V', 'PERCENTAGE', 5.0, 'DOMESTIC'),
-- Economy Saver (Lowest Commission)
(1, 1, '6E', 'ECONOMY', 'S,W', 'PERCENTAGE', 3.0, 'DOMESTIC'),
-- International Economy
(1, 1, '6E', 'ECONOMY', NULL, 'PERCENTAGE', 4.0, 'INTERNATIONAL');

-- Air India (AI) - Sample Commission
INSERT INTO airline_commission_master (tenant_id, supplier_id, airline_code, airline_name,
    default_commission_type, default_commission_value, plb_enabled, plb_percentage, has_class_rules)
VALUES
(1, 1, 'AI', 'Air India', 'PERCENTAGE', 5.0, true, 1.5, true);

-- Air India Class-wise Commission
INSERT INTO class_commission_rules (tenant_id, airline_commission_id, airline_code, cabin_class,
    fare_classes, commission_type, commission_value, travel_type)
VALUES
-- First Class
(1, 2, 'AI', 'FIRST', 'F,A,P', 'PERCENTAGE', 9.0, NULL),
-- Business Class
(1, 2, 'AI', 'BUSINESS', 'J,C,D,I,Z', 'PERCENTAGE', 7.0, NULL),
-- Premium Economy
(1, 2, 'AI', 'PREMIUM_ECONOMY', 'W,E', 'PERCENTAGE', 6.0, NULL),
-- Economy Full
(1, 2, 'AI', 'ECONOMY', 'Y,B,M,H,K', 'PERCENTAGE', 5.0, 'DOMESTIC'),
(1, 2, 'AI', 'ECONOMY', 'Y,B,M,H,K', 'PERCENTAGE', 4.0, 'INTERNATIONAL'),
-- Economy Discounted
(1, 2, 'AI', 'ECONOMY', 'L,Q,T,N,R,X,G,V', 'PERCENTAGE', 3.0, NULL);
