-- =====================================================
-- TRIPCODE TRAVEL CERTIFICATION & LMS SYSTEM
-- Complete Database Schema
-- =====================================================

-- 1. CERTIFICATION BODIES & ASSOCIATIONS
-- =====================================================
CREATE TABLE certification_bodies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(500),
    type VARCHAR(50) NOT NULL, -- 'certification', 'association', 'training_provider', 'government'
    category VARCHAR(100), -- 'international', 'national', 'regional', 'gds', 'specialized'
    country VARCHAR(100) DEFAULT 'India',
    website VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    logo_url VARCHAR(500),
    description TEXT,
    partnership_status VARCHAR(50) DEFAULT 'prospect', -- 'prospect', 'in_progress', 'partner', 'authorized_center'
    partnership_type VARCHAR(100), -- 'referral', 'authorized_training_center', 'affiliate', 'reseller'
    commission_percentage DECIMAL(5,2) DEFAULT 0,
    partnership_start_date DATE,
    partnership_end_date DATE,
    contact_person_name VARCHAR(255),
    contact_person_email VARCHAR(255),
    contact_person_phone VARCHAR(50),
    mou_document_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CERTIFICATIONS & MEMBERSHIPS CATALOG
-- =====================================================
CREATE TABLE certifications_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    body_id UUID REFERENCES certification_bodies(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    type VARCHAR(50) NOT NULL, -- 'certification', 'diploma', 'degree', 'membership', 'accreditation', 'license'
    category VARCHAR(100), -- 'travel_agent', 'tour_operator', 'ticketing', 'gds', 'destination', 'specialized'
    level VARCHAR(50), -- 'foundation', 'intermediate', 'advanced', 'expert', 'master'
    description TEXT,
    eligibility_criteria JSONB, -- {min_experience, min_education, prerequisites}
    benefits TEXT[],
    validity_period_months INTEGER, -- NULL for lifetime
    is_renewable BOOLEAN DEFAULT true,
    renewal_period_months INTEGER,

    -- Pricing
    official_fee DECIMAL(12,2),
    our_fee DECIMAL(12,2),
    our_commission DECIMAL(12,2),
    renewal_fee DECIMAL(12,2),
    exam_fee DECIMAL(12,2),

    -- Process
    application_process TEXT,
    documents_required TEXT[],
    processing_time_days INTEGER,
    has_exam BOOLEAN DEFAULT false,
    has_training BOOLEAN DEFAULT false,
    training_hours INTEGER,

    -- Our courses mapping
    preparation_course_id UUID,

    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(body_id, code)
);

-- 3. COURSE CATEGORIES
-- =====================================================
CREATE TABLE course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    parent_id UUID REFERENCES course_categories(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. COURSES (LMS)
-- =====================================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    category_id UUID REFERENCES course_categories(id),
    certification_id UUID REFERENCES certifications_catalog(id),

    code VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    short_description VARCHAR(1000),

    -- Course details
    course_type VARCHAR(50) NOT NULL, -- 'self_paced', 'instructor_led', 'hybrid', 'live_webinar'
    level VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'expert'
    language VARCHAR(50) DEFAULT 'English',
    languages_available VARCHAR(50)[] DEFAULT ARRAY['English', 'Hindi'],

    -- Duration
    duration_hours INTEGER NOT NULL,
    duration_weeks INTEGER,
    lectures_count INTEGER DEFAULT 0,
    modules_count INTEGER DEFAULT 0,

    -- Media
    thumbnail_url VARCHAR(500),
    preview_video_url VARCHAR(500),

    -- Pricing
    original_price DECIMAL(12,2) NOT NULL,
    selling_price DECIMAL(12,2) NOT NULL,
    gst_percentage DECIMAL(5,2) DEFAULT 18,
    discount_percentage DECIMAL(5,2) DEFAULT 0,

    -- Features
    features TEXT[],
    what_you_learn TEXT[],
    requirements TEXT[],
    target_audience TEXT[],

    -- Certification
    has_certificate BOOLEAN DEFAULT true,
    certificate_template_id UUID,

    -- Assessment
    has_exam BOOLEAN DEFAULT true,
    passing_percentage DECIMAL(5,2) DEFAULT 70,
    max_exam_attempts INTEGER DEFAULT 3,

    -- Instructors
    instructor_ids UUID[],

    -- Stats
    enrolled_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,

    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_review', 'published', 'archived'
    published_at TIMESTAMP,

    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    meta_keywords VARCHAR(500),

    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,

    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. COURSE MODULES
-- =====================================================
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 0,
    display_order INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. COURSE LESSONS
-- =====================================================
CREATE TABLE course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,

    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'video', 'document', 'quiz', 'assignment', 'live_session', 'downloadable'

    -- Video content
    video_url VARCHAR(500),
    video_duration_seconds INTEGER,
    video_provider VARCHAR(50), -- 'youtube', 'vimeo', 'bunny', 'cloudflare', 's3'

    -- Document content
    document_url VARCHAR(500),
    document_type VARCHAR(50), -- 'pdf', 'ppt', 'doc', 'html'

    -- Rich text content
    html_content TEXT,

    -- Downloadable resources
    resources JSONB, -- [{name, url, type, size}]

    duration_minutes INTEGER DEFAULT 0,
    display_order INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    is_mandatory BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. COURSE ENROLLMENTS
-- =====================================================
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    course_id UUID REFERENCES courses(id),
    user_id UUID NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- 'agent', 'customer', 'staff'

    -- Payment
    order_id UUID,
    amount_paid DECIMAL(12,2),
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),

    -- Progress
    status VARCHAR(50) DEFAULT 'enrolled', -- 'enrolled', 'in_progress', 'completed', 'expired', 'suspended'
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,

    -- Time tracking
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    last_lesson_id UUID,

    -- Completion
    completed_at TIMESTAMP,
    completion_certificate_id UUID,

    -- Expiry
    expires_at TIMESTAMP,

    -- Exam
    exam_attempts INTEGER DEFAULT 0,
    exam_passed BOOLEAN DEFAULT false,
    exam_score DECIMAL(5,2),

    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. LESSON PROGRESS
-- =====================================================
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,

    status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    video_position_seconds INTEGER DEFAULT 0,

    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(enrollment_id, lesson_id)
);

-- 9. EXAMS / QUIZZES
-- =====================================================
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    course_id UUID REFERENCES courses(id),
    certification_id UUID REFERENCES certifications_catalog(id),

    title VARCHAR(500) NOT NULL,
    description TEXT,
    instructions TEXT,

    exam_type VARCHAR(50) NOT NULL, -- 'quiz', 'module_test', 'final_exam', 'certification_exam', 'practice_test'

    -- Configuration
    duration_minutes INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    total_marks DECIMAL(8,2) NOT NULL,
    passing_marks DECIMAL(8,2) NOT NULL,
    passing_percentage DECIMAL(5,2) NOT NULL,

    -- Question selection
    question_selection VARCHAR(50) DEFAULT 'fixed', -- 'fixed', 'random', 'random_per_section'
    questions_per_attempt INTEGER, -- for random selection

    -- Attempt limits
    max_attempts INTEGER DEFAULT 3,
    attempt_gap_hours INTEGER DEFAULT 24, -- minimum gap between attempts

    -- Features
    show_correct_answers BOOLEAN DEFAULT false,
    show_score_immediately BOOLEAN DEFAULT true,
    shuffle_questions BOOLEAN DEFAULT true,
    shuffle_options BOOLEAN DEFAULT true,
    allow_review BOOLEAN DEFAULT true,
    negative_marking BOOLEAN DEFAULT false,
    negative_marks_percentage DECIMAL(5,2) DEFAULT 25,

    -- Proctoring
    enable_proctoring BOOLEAN DEFAULT false,
    webcam_required BOOLEAN DEFAULT false,
    prevent_tab_switch BOOLEAN DEFAULT true,

    -- Scheduling
    available_from TIMESTAMP,
    available_until TIMESTAMP,

    -- Fee
    exam_fee DECIMAL(12,2) DEFAULT 0,

    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    is_active BOOLEAN DEFAULT true,

    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. EXAM SECTIONS
-- =====================================================
CREATE TABLE exam_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions_count INTEGER NOT NULL,
    marks_per_question DECIMAL(5,2) DEFAULT 1,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 11. QUESTION BANK
-- =====================================================
CREATE TABLE question_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    course_id UUID REFERENCES courses(id),
    exam_id UUID REFERENCES exams(id),
    section_id UUID REFERENCES exam_sections(id),

    question_type VARCHAR(50) NOT NULL, -- 'mcq_single', 'mcq_multiple', 'true_false', 'fill_blank', 'match', 'subjective'
    difficulty VARCHAR(50) DEFAULT 'medium', -- 'easy', 'medium', 'hard'

    question_text TEXT NOT NULL,
    question_html TEXT,
    question_image_url VARCHAR(500),

    -- For MCQ
    options JSONB, -- [{id, text, image_url, is_correct}]
    correct_option_ids VARCHAR(50)[],

    -- For fill in blank / subjective
    correct_answer TEXT,
    answer_keywords TEXT[],

    -- For matching
    match_pairs JSONB, -- [{left, right}]

    explanation TEXT,
    explanation_video_url VARCHAR(500),

    marks DECIMAL(5,2) DEFAULT 1,
    time_limit_seconds INTEGER, -- per question time limit

    tags VARCHAR(100)[],
    topic VARCHAR(255),

    usage_count INTEGER DEFAULT 0,
    correct_rate DECIMAL(5,2),

    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. EXAM ATTEMPTS
-- =====================================================
CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    exam_id UUID REFERENCES exams(id),
    enrollment_id UUID REFERENCES course_enrollments(id),
    user_id UUID NOT NULL,
    user_type VARCHAR(50) NOT NULL,

    attempt_number INTEGER NOT NULL,

    -- Timing
    started_at TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP,
    time_taken_seconds INTEGER,

    -- Questions
    questions_data JSONB, -- [{question_id, selected_options, answer, time_spent, is_marked}]
    total_questions INTEGER,
    answered_questions INTEGER DEFAULT 0,

    -- Results
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'evaluated', 'expired', 'disqualified'
    total_marks DECIMAL(8,2),
    obtained_marks DECIMAL(8,2),
    percentage DECIMAL(5,2),
    is_passed BOOLEAN,
    grade VARCHAR(10),

    -- Proctoring
    proctoring_data JSONB, -- {tab_switches, warnings, screenshots}
    proctoring_score DECIMAL(5,2),

    ip_address VARCHAR(50),
    user_agent TEXT,

    evaluated_by UUID,
    evaluated_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. EXAM RESPONSES
-- =====================================================
CREATE TABLE exam_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES question_bank(id),

    selected_option_ids VARCHAR(50)[],
    answer_text TEXT,
    match_response JSONB,

    is_correct BOOLEAN,
    marks_obtained DECIMAL(5,2),

    time_spent_seconds INTEGER,
    is_marked_for_review BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. CERTIFICATES
-- =====================================================
CREATE TABLE certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'course_completion', 'certification', 'membership', 'achievement'

    -- Design
    template_html TEXT,
    background_image_url VARCHAR(500),
    logo_url VARCHAR(500),
    signature_image_url VARCHAR(500),
    signatory_name VARCHAR(255),
    signatory_designation VARCHAR(255),

    -- Dimensions
    width_px INTEGER DEFAULT 1200,
    height_px INTEGER DEFAULT 800,
    orientation VARCHAR(20) DEFAULT 'landscape',

    -- Variables available
    available_variables TEXT[], -- ['name', 'course', 'date', 'certificate_id', etc.]

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE issued_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    template_id UUID REFERENCES certificate_templates(id),

    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    qr_code_url VARCHAR(500),

    -- Recipient
    user_id UUID NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255),

    -- Related to
    course_id UUID REFERENCES courses(id),
    enrollment_id UUID REFERENCES course_enrollments(id),
    exam_attempt_id UUID REFERENCES exam_attempts(id),
    certification_id UUID REFERENCES certifications_catalog(id),
    membership_application_id UUID,

    -- Certificate details
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    grade VARCHAR(50),
    score DECIMAL(5,2),

    -- Dates
    issue_date DATE NOT NULL,
    valid_from DATE,
    valid_until DATE, -- NULL for lifetime

    -- Files
    pdf_url VARCHAR(500),
    image_url VARCHAR(500),

    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'revoked', 'superseded'
    revoked_at TIMESTAMP,
    revoked_reason TEXT,

    -- Sharing
    linkedin_shared BOOLEAN DEFAULT false,
    public_view_enabled BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. MEMBERSHIP APPLICATIONS
-- =====================================================
CREATE TABLE membership_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    body_id UUID REFERENCES certification_bodies(id),
    certification_id UUID REFERENCES certifications_catalog(id),

    -- Applicant
    user_id UUID NOT NULL,
    user_type VARCHAR(50) NOT NULL,

    -- Application details
    application_number VARCHAR(100) UNIQUE,
    membership_type VARCHAR(100), -- 'individual', 'corporate', 'associate', 'affiliate'

    -- Personal/Business Info
    applicant_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),

    -- Business details
    business_type VARCHAR(100), -- 'proprietorship', 'partnership', 'pvt_ltd', 'llp'
    gst_number VARCHAR(50),
    pan_number VARCHAR(20),
    year_established INTEGER,
    annual_turnover VARCHAR(100),
    employee_count INTEGER,

    -- Documents
    documents JSONB, -- [{type, name, url, verified}]

    -- Fees
    application_fee DECIMAL(12,2),
    membership_fee DECIMAL(12,2),
    total_fee DECIMAL(12,2),
    our_commission DECIMAL(12,2),

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_transaction_id VARCHAR(255),
    payment_date TIMESTAMP,

    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'documents_requested', 'approved', 'rejected', 'payment_pending'
    submitted_at TIMESTAMP,
    processed_at TIMESTAMP,

    -- From association
    membership_number VARCHAR(100),
    membership_valid_from DATE,
    membership_valid_until DATE,

    -- Notes
    applicant_notes TEXT,
    admin_notes TEXT,
    rejection_reason TEXT,

    processed_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. INSTRUCTORS
-- =====================================================
CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),

    title VARCHAR(255),
    bio TEXT,
    short_bio VARCHAR(500),

    photo_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    website_url VARCHAR(500),

    expertise_areas TEXT[],
    certifications TEXT[],
    experience_years INTEGER,

    courses_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,

    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. COURSE REVIEWS
-- =====================================================
CREATE TABLE course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES course_enrollments(id),
    user_id UUID NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    user_name VARCHAR(255),

    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,

    -- Detailed ratings
    content_rating INTEGER,
    instructor_rating INTEGER,
    value_rating INTEGER,

    is_verified_purchase BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,

    helpful_count INTEGER DEFAULT 0,

    admin_response TEXT,
    admin_response_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. REVENUE TRACKING
-- =====================================================
CREATE TABLE certification_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),

    -- Source
    source_type VARCHAR(50) NOT NULL, -- 'course', 'exam', 'membership', 'renewal', 'certificate'
    source_id UUID NOT NULL,

    -- Related entities
    course_id UUID REFERENCES courses(id),
    enrollment_id UUID REFERENCES course_enrollments(id),
    exam_attempt_id UUID REFERENCES exam_attempts(id),
    membership_id UUID REFERENCES membership_applications(id),
    certification_id UUID REFERENCES certifications_catalog(id),
    body_id UUID REFERENCES certification_bodies(id),

    -- User
    user_id UUID NOT NULL,
    user_type VARCHAR(50) NOT NULL,

    -- Amounts
    gross_amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    gst_amount DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL,

    -- Commissions
    partner_share DECIMAL(12,2) DEFAULT 0, -- paid to certification body
    platform_revenue DECIMAL(12,2) NOT NULL, -- our revenue

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,

    description VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. PARTNERSHIP PROPOSALS
-- =====================================================
CREATE TABLE partnership_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    body_id UUID REFERENCES certification_bodies(id),

    proposal_number VARCHAR(50) UNIQUE,
    proposal_type VARCHAR(100), -- 'training_center', 'affiliate', 'reseller', 'referral'

    -- Our details
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Proposal content
    subject VARCHAR(500),
    proposal_letter TEXT,
    proposal_document_url VARCHAR(500),

    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'acknowledged', 'under_review', 'approved', 'rejected', 'negotiating'
    sent_at TIMESTAMP,
    response_received_at TIMESTAMP,
    response_notes TEXT,

    -- Follow-ups
    follow_ups JSONB, -- [{date, notes, by}]
    next_follow_up_date DATE,

    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. RENEWAL REMINDERS
-- =====================================================
CREATE TABLE certification_renewals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),

    user_id UUID NOT NULL,
    user_type VARCHAR(50) NOT NULL,

    -- What to renew
    renewal_type VARCHAR(50) NOT NULL, -- 'membership', 'certification', 'certificate'
    membership_id UUID REFERENCES membership_applications(id),
    certificate_id UUID REFERENCES issued_certificates(id),
    certification_id UUID REFERENCES certifications_catalog(id),

    current_expiry_date DATE NOT NULL,

    -- Reminders
    reminder_30_days_sent BOOLEAN DEFAULT false,
    reminder_15_days_sent BOOLEAN DEFAULT false,
    reminder_7_days_sent BOOLEAN DEFAULT false,
    reminder_expired_sent BOOLEAN DEFAULT false,

    -- Renewal
    renewal_initiated BOOLEAN DEFAULT false,
    renewed_at TIMESTAMP,
    new_expiry_date DATE,
    renewal_fee DECIMAL(12,2),

    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reminded', 'renewed', 'expired', 'lapsed'

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
-- =====================================================
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_certification ON courses(certification_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id, user_type);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);
CREATE INDEX idx_exam_attempts_user ON exam_attempts(user_id);
CREATE INDEX idx_certificates_user ON issued_certificates(user_id);
CREATE INDEX idx_certificates_verification ON issued_certificates(verification_code);
CREATE INDEX idx_membership_user ON membership_applications(user_id);
CREATE INDEX idx_revenue_date ON certification_revenue(created_at);
CREATE INDEX idx_renewals_expiry ON certification_renewals(current_expiry_date);

-- =====================================================
-- SEED DATA: CERTIFICATION BODIES & ASSOCIATIONS
-- =====================================================

INSERT INTO certification_bodies (code, name, full_name, type, category, country, website, description, is_active) VALUES

-- INTERNATIONAL CERTIFICATIONS
('IATA', 'IATA', 'International Air Transport Association', 'certification', 'international', 'Global', 'https://www.iata.org', 'Global trade association for airlines - offers travel agent accreditation and training programs', true),
('UFTAA', 'UFTAA', 'United Federation of Travel Agents Associations', 'association', 'international', 'Global', 'https://www.uftaa.org', 'International federation representing travel agents worldwide', true),
('WTTC', 'WTTC', 'World Travel & Tourism Council', 'association', 'international', 'Global', 'https://www.wttc.org', 'Forum for global travel and tourism industry leaders', true),
('ASTA', 'ASTA', 'American Society of Travel Advisors', 'association', 'international', 'USA', 'https://www.asta.org', 'Leading travel advisor association with global recognition', true),
('CLIA', 'CLIA', 'Cruise Lines International Association', 'certification', 'international', 'Global', 'https://cruising.org', 'World''s largest cruise industry trade association', true),
('PATA', 'PATA', 'Pacific Asia Travel Association', 'association', 'international', 'Asia-Pacific', 'https://www.pata.org', 'Travel association for Asia Pacific region', true),
('UNWTO', 'UNWTO', 'United Nations World Tourism Organization', 'association', 'international', 'Global', 'https://www.unwto.org', 'UN agency responsible for promotion of responsible tourism', true),

-- INDIAN ASSOCIATIONS
('TAFI', 'TAFI', 'Travel Agents Federation of India', 'association', 'national', 'India', 'https://www.tafi.in', 'Premier travel agents body in India with 2000+ members', true),
('IATO', 'IATO', 'Indian Association of Tour Operators', 'association', 'national', 'India', 'https://www.iato.in', 'National body of tour operators promoting inbound tourism', true),
('TAAI', 'TAAI', 'Travel Agents Association of India', 'association', 'national', 'India', 'https://www.taai.in', 'One of the oldest travel trade associations in India since 1951', true),
('ADTOI', 'ADTOI', 'Association of Domestic Tour Operators of India', 'association', 'national', 'India', 'https://www.adtoi.org', 'Represents domestic tour operators across India', true),
('OTOAI', 'OTOAI', 'Outbound Tour Operators Association of India', 'association', 'national', 'India', 'https://www.otoai.org', 'Association for outbound travel operators', true),
('ETAA', 'ETAA', 'Enterprising Travel Agents Association', 'association', 'national', 'India', 'https://www.etaa.in', 'Growing community of travel entrepreneurs', true),
('ATOAI', 'ATOAI', 'Adventure Tour Operators Association of India', 'association', 'national', 'India', 'https://www.atoai.org', 'Body for adventure tourism operators', true),
('ICPB', 'ICPB', 'India Convention Promotion Bureau', 'association', 'national', 'India', 'https://www.icpb.org', 'Promotes India as MICE destination', true),
('FHRAI', 'FHRAI', 'Federation of Hotel & Restaurant Associations of India', 'association', 'national', 'India', 'https://www.fhrai.com', 'Apex body of hotel and restaurant industry', true),

-- GOVERNMENT BODIES
('IITTM', 'IITTM', 'Indian Institute of Tourism and Travel Management', 'certification', 'government', 'India', 'https://www.iittm.ac.in', 'Premier government institute for tourism education', true),
('IGNOU', 'IGNOU', 'Indira Gandhi National Open University', 'certification', 'government', 'India', 'https://www.ignou.ac.in', 'Distance learning programs in tourism', true),
('NCHMCT', 'NCHMCT', 'National Council for Hotel Management and Catering Technology', 'certification', 'government', 'India', 'https://www.nchm.nic.in', 'Government body for hospitality education', true),
('MOT', 'MOT', 'Ministry of Tourism, India', 'government', 'government', 'India', 'https://tourism.gov.in', 'Central government ministry for tourism', true),

-- GDS PROVIDERS
('AMADEUS', 'Amadeus', 'Amadeus IT Group', 'training_provider', 'gds', 'Global', 'https://www.amadeus.com', 'Leading GDS provider with comprehensive training programs', true),
('SABRE', 'Sabre', 'Sabre Corporation', 'training_provider', 'gds', 'Global', 'https://www.sabre.com', 'Major GDS with travel technology solutions', true),
('GALILEO', 'Galileo', 'Travelport Galileo', 'training_provider', 'gds', 'Global', 'https://www.travelport.com', 'Part of Travelport GDS family', true),
('WORLDSPAN', 'Worldspan', 'Travelport Worldspan', 'training_provider', 'gds', 'Global', 'https://www.travelport.com', 'Travelport''s second GDS platform', true),

-- SPECIALIZED CERTIFICATIONS
('TICO', 'TICO', 'Travel Industry Council of Ontario', 'certification', 'specialized', 'Canada', 'https://www.tico.ca', 'Canadian travel industry regulator', true),
('ABTA', 'ABTA', 'Association of British Travel Agents', 'association', 'specialized', 'UK', 'https://www.abta.com', 'UK''s largest travel trade association', true),
('CTC', 'CTC', 'Certified Travel Counselor', 'certification', 'specialized', 'Global', 'https://www.thetravelinstitute.com', 'Advanced travel professional certification', true),
('CTA', 'CTA', 'Certified Travel Associate', 'certification', 'specialized', 'Global', 'https://www.thetravelinstitute.com', 'Entry-level travel professional certification', true),

-- REGIONAL ASSOCIATIONS (INDIA)
('RATO', 'RATO', 'Rajasthan Association of Tour Operators', 'association', 'regional', 'India', 'https://www.rato.in', 'Tour operators association for Rajasthan', true),
('KATA', 'KATA', 'Kerala Association of Travel Agents', 'association', 'regional', 'India', '', 'Travel agents association for Kerala', true),
('GATO', 'GATO', 'Goa Association of Tour Operators', 'association', 'regional', 'India', '', 'Tour operators association for Goa', true),
('NIMA', 'NIMA', 'North India MICE Association', 'association', 'regional', 'India', '', 'MICE industry association for North India', true);

-- =====================================================
-- SEED DATA: CERTIFICATIONS CATALOG
-- =====================================================

INSERT INTO certifications_catalog (body_id, code, name, type, category, level, description, eligibility_criteria, benefits, validity_period_months, official_fee, our_fee, has_exam, has_training, training_hours, is_popular) VALUES

-- IATA Certifications
((SELECT id FROM certification_bodies WHERE code = 'IATA'), 'IATA-FOUNDATION', 'IATA Foundation in Travel & Tourism', 'certification', 'travel_agent', 'foundation',
'Entry-level certification covering travel industry fundamentals, geography, and customer service',
'{"min_education": "12th Pass", "min_age": 18}',
ARRAY['Industry-recognized credential', 'Foundation for advanced certifications', 'Global recognition', 'Career advancement'],
NULL, 35000, 32999, true, true, 60, true),

((SELECT id FROM certification_bodies WHERE code = 'IATA'), 'IATA-CONSULTANT', 'IATA Travel & Tourism Consultant', 'certification', 'travel_agent', 'intermediate',
'Comprehensive program covering fares, ticketing, and travel consulting',
'{"min_education": "Graduate", "min_experience_months": 6, "prerequisites": ["IATA-FOUNDATION"]}',
ARRAY['Advanced ticketing skills', 'Fare calculation expertise', 'IATA diploma', 'Higher salary potential'],
NULL, 65000, 59999, true, true, 120, true),

((SELECT id FROM certification_bodies WHERE code = 'IATA'), 'IATA-FARES-TICKETING', 'IATA Fares & Ticketing', 'certification', 'ticketing', 'advanced',
'Specialized certification in international fares, ticketing rules, and BSP',
'{"min_education": "Graduate", "min_experience_months": 12}',
ARRAY['Expert fare construction', 'BSP knowledge', 'International ticketing', 'Premium job opportunities'],
NULL, 85000, 79999, true, true, 150, true),

-- GDS Certifications
((SELECT id FROM certification_bodies WHERE code = 'AMADEUS'), 'AMADEUS-BASIC', 'Amadeus Basic Certification', 'certification', 'gds', 'foundation',
'Fundamental Amadeus GDS operations including PNR creation, booking, and ticketing',
'{"min_education": "12th Pass"}',
ARRAY['Amadeus certified', 'GDS proficiency', 'Industry demand', 'Career starter'],
24, 15000, 12999, true, true, 40, true),

((SELECT id FROM certification_bodies WHERE code = 'AMADEUS'), 'AMADEUS-ADVANCED', 'Amadeus Advanced Certification', 'certification', 'gds', 'advanced',
'Advanced Amadeus operations including complex fares, queues, and automation',
'{"min_education": "Graduate", "prerequisites": ["AMADEUS-BASIC"]}',
ARRAY['Advanced GDS skills', 'Automation expertise', 'Premium salary', 'Expert status'],
24, 35000, 29999, true, true, 80, false),

((SELECT id FROM certification_bodies WHERE code = 'SABRE'), 'SABRE-BASIC', 'Sabre Basic Certification', 'certification', 'gds', 'foundation',
'Core Sabre GDS training for reservations and ticketing',
'{"min_education": "12th Pass"}',
ARRAY['Sabre certified', 'US market access', 'GDS skills', 'Career opportunities'],
24, 15000, 12999, true, true, 40, true),

((SELECT id FROM certification_bodies WHERE code = 'GALILEO'), 'GALILEO-TRAVELPORT', 'Galileo/Travelport Certification', 'certification', 'gds', 'foundation',
'Travelport Galileo GDS training and certification',
'{"min_education": "12th Pass"}',
ARRAY['Travelport certified', 'Global reach', 'GDS proficiency', 'Industry credential'],
24, 15000, 12999, true, true, 40, false),

-- IITTM Certifications
((SELECT id FROM certification_bodies WHERE code = 'IITTM'), 'IITTM-DTTM', 'Diploma in Travel & Tourism Management', 'diploma', 'travel_agent', 'foundation',
'Government-recognized diploma covering comprehensive travel and tourism management',
'{"min_education": "12th Pass", "min_age": 17}',
ARRAY['Government recognized', 'Comprehensive curriculum', 'Industry internship', 'Placement assistance'],
NULL, 45000, 42999, true, true, 480, true),

((SELECT id FROM certification_bodies WHERE code = 'IITTM'), 'IITTM-PGDTM', 'PG Diploma in Tourism Management', 'diploma', 'travel_agent', 'advanced',
'Postgraduate diploma for advanced tourism management careers',
'{"min_education": "Graduate", "min_age": 21}',
ARRAY['PG qualification', 'Management skills', 'Government certificate', 'Senior positions'],
NULL, 85000, 79999, true, true, 960, false),

-- Association Memberships
((SELECT id FROM certification_bodies WHERE code = 'TAFI'), 'TAFI-MEMBER', 'TAFI Active Membership', 'membership', 'travel_agent', 'foundation',
'Active membership of Travel Agents Federation of India',
'{"min_experience_months": 12, "business_type": "travel_agency", "iata_or_non_iata": "either"}',
ARRAY['Industry networking', 'TAFI conventions', 'Business support', 'Credibility', 'Dispute resolution'],
12, 15000, 17999, false, false, 0, true),

((SELECT id FROM certification_bodies WHERE code = 'IATO'), 'IATO-MEMBER', 'IATO Active Membership', 'membership', 'tour_operator', 'foundation',
'Membership for inbound tour operators',
'{"min_experience_months": 24, "business_type": "tour_operator", "focus": "inbound"}',
ARRAY['Inbound tourism network', 'Government liaison', 'Trade fairs', 'Marketing support'],
12, 20000, 23999, false, false, 0, true),

((SELECT id FROM certification_bodies WHERE code = 'TAAI'), 'TAAI-MEMBER', 'TAAI Membership', 'membership', 'travel_agent', 'foundation',
'Membership of Travel Agents Association of India',
'{"min_experience_months": 12, "business_type": "travel_agency"}',
ARRAY['Legacy association', 'Industry events', 'Training programs', 'Business networking'],
12, 12000, 14999, false, false, 0, true),

((SELECT id FROM certification_bodies WHERE code = 'ADTOI'), 'ADTOI-MEMBER', 'ADTOI Membership', 'membership', 'tour_operator', 'foundation',
'Membership for domestic tour operators',
'{"min_experience_months": 12, "business_type": "tour_operator", "focus": "domestic"}',
ARRAY['Domestic tourism focus', 'Regional networking', 'Govt schemes access', 'Trade events'],
12, 10000, 12999, false, false, 0, false),

((SELECT id FROM certification_bodies WHERE code = 'OTOAI'), 'OTOAI-MEMBER', 'OTOAI Membership', 'membership', 'tour_operator', 'foundation',
'Membership for outbound tour operators',
'{"min_experience_months": 12, "business_type": "tour_operator", "focus": "outbound"}',
ARRAY['Outbound focus', 'International partnerships', 'FAM trips', 'Training'],
12, 15000, 17999, false, false, 0, false),

((SELECT id FROM certification_bodies WHERE code = 'ATOAI'), 'ATOAI-MEMBER', 'ATOAI Membership', 'membership', 'tour_operator', 'foundation',
'Membership for adventure tour operators',
'{"min_experience_months": 24, "business_type": "adventure_tourism"}',
ARRAY['Adventure tourism network', 'Safety standards', 'Govt recognition', 'Training'],
12, 12000, 14999, false, false, 0, false),

-- Cruise Certifications
((SELECT id FROM certification_bodies WHERE code = 'CLIA'), 'CLIA-ACC', 'CLIA Accredited Cruise Counsellor', 'certification', 'specialized', 'foundation',
'Entry-level cruise specialist certification',
'{"min_education": "12th Pass"}',
ARRAY['Cruise selling skills', 'CLIA network', 'FAM cruise access', 'Cruise expertise'],
12, 8000, 7499, true, true, 20, true),

((SELECT id FROM certification_bodies WHERE code = 'CLIA'), 'CLIA-MCC', 'CLIA Master Cruise Counsellor', 'certification', 'specialized', 'advanced',
'Advanced cruise specialist certification',
'{"min_education": "Graduate", "prerequisites": ["CLIA-ACC"], "cruise_experience": "5 cruises"}',
ARRAY['Master status', 'Premium FAMs', 'Higher commissions', 'Elite network'],
12, 25000, 22999, true, true, 40, false),

-- Destination Specialist Certifications
((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-DUBAI', 'Dubai Destination Specialist', 'certification', 'destination', 'intermediate',
'Certified specialist for Dubai tourism and products',
'{"min_education": "12th Pass"}',
ARRAY['Dubai expertise', 'Better commissions', 'DMC connections', 'Preferred partner'],
24, 5000, 4999, true, true, 15, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-EUROPE', 'Europe Travel Specialist', 'certification', 'destination', 'intermediate',
'Certified specialist for European destinations',
'{"min_education": "12th Pass"}',
ARRAY['Europe expertise', 'Schengen knowledge', 'Tour planning', 'Supplier network'],
24, 7500, 6999, true, true, 25, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-THAILAND', 'Thailand Travel Specialist', 'certification', 'destination', 'intermediate',
'Certified specialist for Thailand tourism',
'{"min_education": "12th Pass"}',
ARRAY['Thailand expertise', 'Better rates', 'DMC access', 'Product knowledge'],
24, 4000, 3999, true, true, 12, true),

-- Business Startup Certifications
((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-STARTUP', 'Travel Business Startup Certification', 'certification', 'travel_agent', 'foundation',
'Complete guide to starting and running a travel business',
'{"min_education": "Graduate", "min_age": 21}',
ARRAY['Business setup guide', 'Legal compliance', 'Marketing strategies', 'Operations training'],
NULL, 15000, 12999, true, true, 50, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-IATA-PREP', 'IATA Accreditation Preparation', 'certification', 'travel_agent', 'intermediate',
'Prepare for IATA agency accreditation process',
'{"min_education": "Graduate", "business_type": "travel_agency"}',
ARRAY['IATA process guide', 'Documentation help', 'Compliance training', 'Success roadmap'],
NULL, 25000, 22999, true, true, 30, true);

-- Add TripCode as certification body for own courses
INSERT INTO certification_bodies (code, name, full_name, type, category, country, website, description, partnership_status, is_active)
VALUES ('TRIPCODE', 'TripCode Academy', 'TripCode Travel Academy', 'training_provider', 'specialized', 'India', 'https://tripcode.in/academy', 'In-house training and certification programs', 'partner', true);
