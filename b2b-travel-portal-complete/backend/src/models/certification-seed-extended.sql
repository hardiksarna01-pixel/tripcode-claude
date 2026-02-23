-- =====================================================
-- EXTENDED CERTIFICATION SEED DATA
-- Additional Certifications, Associations & Courses
-- =====================================================

-- MORE INTERNATIONAL CERTIFICATION BODIES
INSERT INTO certification_bodies (code, name, full_name, type, category, country, website, description, is_active) VALUES

-- Tourism Boards for Destination Training
('DET', 'Dubai Tourism', 'Dubai Department of Economy and Tourism', 'training_provider', 'international', 'UAE', 'https://www.visitdubai.com/trade', 'Official Dubai tourism body - Dubai Expert Program', true),
('SGTB', 'Singapore Tourism Board', 'Singapore Tourism Board', 'training_provider', 'international', 'Singapore', 'https://www.stb.gov.sg', 'Singapore tourism promotions and training', true),
('TAT', 'TAT', 'Tourism Authority of Thailand', 'training_provider', 'international', 'Thailand', 'https://www.tourismthailand.org', 'Thailand tourism authority', true),
('MYT', 'Tourism Malaysia', 'Tourism Malaysia', 'training_provider', 'international', 'Malaysia', 'https://www.tourism.gov.my', 'Malaysia tourism promotions', true),
('HKTB', 'HKTB', 'Hong Kong Tourism Board', 'training_provider', 'international', 'Hong Kong', 'https://www.discoverhongkong.com/trade', 'Hong Kong tourism trade programs', true),
('ATE', 'Tourism Australia', 'Tourism Australia', 'training_provider', 'international', 'Australia', 'https://www.australia.com/trade', 'Aussie Specialist Program', true),
('NZT', 'Tourism New Zealand', 'Tourism New Zealand', 'training_provider', 'international', 'New Zealand', 'https://traveltrade.newzealand.com', 'Kiwi Specialist Program', true),
('VJ', 'VisitJapan', 'Japan National Tourism Organization', 'training_provider', 'international', 'Japan', 'https://www.japan.travel/trade', 'Japan Specialist Program', true),
('VB', 'VisitBritain', 'VisitBritain', 'training_provider', 'international', 'UK', 'https://trade.visitbritain.com', 'Britain Expert Program', true),
('GNTO', 'GNTO', 'Greek National Tourism Organisation', 'training_provider', 'international', 'Greece', 'https://www.visitgreece.gr', 'Greece tourism training', true),
('ENIT', 'ENIT', 'Italian National Tourist Board', 'training_provider', 'international', 'Italy', 'https://www.italia.it', 'Italy destination training', true),
('Atout', 'Atout France', 'Atout France', 'training_provider', 'international', 'France', 'https://www.france.fr', 'France Expert Program', true),
('SNTO', 'Switzerland Tourism', 'Switzerland Tourism', 'training_provider', 'international', 'Switzerland', 'https://www.myswitzerland.com/trade', 'Switzerland Travel Expert', true),
('STC', 'South African Tourism', 'South African Tourism', 'training_provider', 'international', 'South Africa', 'https://www.southafrica.net/trade', 'Fundi Travel Expert', true),
('TUI', 'TUI Academy', 'TUI Travel Training Academy', 'training_provider', 'international', 'Global', 'https://www.tuigroup.com', 'Global travel training programs', true),

-- More Indian Associations
('SKAL', 'SKAL India', 'SKAL International India', 'association', 'national', 'India', 'https://www.skalindi.org', 'International tourism networking club', true),
('TTAG', 'TTAG', 'Travel & Tourism Association of Goa', 'association', 'regional', 'India', '', 'Goa tourism trade body', true),
('HRANI', 'HRANI', 'Hotel & Restaurant Association of Northern India', 'association', 'regional', 'India', 'https://www.hrani.net.in', 'Northern India hospitality association', true),
('SIHRA', 'SIHRA', 'South India Hotel & Restaurants Association', 'association', 'regional', 'India', 'https://www.sihra.in', 'South India hospitality body', true),
('HRAWI', 'HRAWI', 'Hotel & Restaurant Association of Western India', 'association', 'regional', 'India', 'https://www.hrawi.org', 'Western India hospitality association', true),
('WTTAI', 'WTTAI', 'West Bengal Travel & Tourism Association', 'association', 'regional', 'India', '', 'West Bengal travel trade', true),
('MTTA', 'MTTA', 'Maharashtra Travel & Tourism Association', 'association', 'regional', 'India', '', 'Maharashtra travel trade body', true),
('TTAK', 'TTAK', 'Travel & Tourism Association of Karnataka', 'association', 'regional', 'India', '', 'Karnataka travel association', true),
('TTAAP', 'TTAAP', 'Travel Trade Association of Andhra Pradesh', 'association', 'regional', 'India', '', 'Andhra Pradesh travel trade', true),
('UTTOA', 'UTTOA', 'Uttarakhand Tour Operators Association', 'association', 'regional', 'India', '', 'Uttarakhand tourism operators', true),
('HPTOA', 'HPTOA', 'Himachal Pradesh Tour Operators Association', 'association', 'regional', 'India', '', 'Himachal tourism operators', true),
('JKTOA', 'JKTOA', 'Jammu & Kashmir Tour Operators Association', 'association', 'regional', 'India', '', 'J&K tourism operators', true),
('NETOA', 'NETOA', 'North East Tour Operators Association', 'association', 'regional', 'India', '', 'North East tourism body', true),

-- Specialized Training Providers
('TCE', 'The Cruise Edge', 'The Cruise Edge Academy', 'training_provider', 'specialized', 'Global', 'https://thecruiseedge.com', 'Cruise sales training', true),
('CCRA', 'CCRA', 'CCRA Travel Commerce Network', 'training_provider', 'specialized', 'USA', 'https://www.ccra.com', 'Hotel booking and sales training', true),
('TTI', 'TTI', 'The Travel Institute', 'certification', 'specialized', 'USA', 'https://www.thetravelinstitute.com', 'Professional travel certifications', true),
('GBTA', 'GBTA', 'Global Business Travel Association', 'certification', 'specialized', 'Global', 'https://www.gbta.org', 'Corporate travel certifications', true),
('SITE', 'SITE', 'Society for Incentive Travel Excellence', 'certification', 'specialized', 'Global', 'https://www.siteglobal.com', 'Incentive travel certifications', true),
('MPI', 'MPI', 'Meeting Professionals International', 'certification', 'specialized', 'Global', 'https://www.mpi.org', 'Event and meeting certifications', true),
('PCMA', 'PCMA', 'Professional Convention Management Association', 'certification', 'specialized', 'Global', 'https://www.pcma.org', 'Convention management training', true),

-- Hotel Chains with Training
('MARRIOTT', 'Marriott', 'Marriott Bonvoy Travel Professional Program', 'training_provider', 'specialized', 'Global', 'https://travel-professional.marriott.com', 'Marriott hotel specialist', true),
('HILTON', 'Hilton', 'Hilton Travel Professional Program', 'training_provider', 'specialized', 'Global', 'https://www.hiltontravelprofessional.com', 'Hilton hotel specialist', true),
('IHG', 'IHG', 'IHG Hotel Sales Academy', 'training_provider', 'specialized', 'Global', 'https://www.ihg.com/hotels/trade', 'IHG hotel specialist', true),
('ACCOR', 'Accor', 'Accor Travel Agent Academy', 'training_provider', 'specialized', 'Global', 'https://all.accor.com/trade', 'Accor hotel training', true),
('HYATT', 'Hyatt', 'Hyatt Travel Agent Program', 'training_provider', 'specialized', 'Global', 'https://www.hyatt.com/trade', 'Hyatt hotel specialist', true),

-- Cruise Lines with Certifications
('RCCL', 'Royal Caribbean', 'Royal Caribbean Cruises Ltd', 'training_provider', 'specialized', 'Global', 'https://www.cruisingpower.com', 'Royal Caribbean cruise training', true),
('CCL', 'Carnival', 'Carnival Corporation', 'training_provider', 'specialized', 'Global', 'https://www.goccl.com', 'Carnival cruise training', true),
('NCL', 'Norwegian', 'Norwegian Cruise Line', 'training_provider', 'specialized', 'Global', 'https://www.ncl.com/agent', 'NCL cruise specialist', true),
('MSC', 'MSC Cruises', 'MSC Cruises', 'training_provider', 'specialized', 'Global', 'https://www.msccruises.com/trade', 'MSC cruise training', true),
('DISNEY', 'Disney Cruise', 'Disney Cruise Line', 'training_provider', 'specialized', 'Global', 'https://www.disneytravelagents.com', 'Disney cruise specialist', true),

-- Airlines with Training
('EMIRATES', 'Emirates', 'Emirates Airline', 'training_provider', 'specialized', 'UAE', 'https://www.emirates.com/trade', 'Emirates product training', true),
('SQ', 'Singapore Airlines', 'Singapore Airlines', 'training_provider', 'specialized', 'Singapore', 'https://www.singaporeair.com/trade', 'SQ product specialist', true),
('QR', 'Qatar Airways', 'Qatar Airways', 'training_provider', 'specialized', 'Qatar', 'https://www.qatarairways.com/trade', 'Qatar Airways training', true),
('EY', 'Etihad', 'Etihad Airways', 'training_provider', 'specialized', 'UAE', 'https://www.etihad.com/trade', 'Etihad product training', true),
('AI', 'Air India', 'Air India', 'training_provider', 'specialized', 'India', 'https://www.airindia.com', 'Air India product training', true);

-- =====================================================
-- ADDITIONAL CERTIFICATIONS
-- =====================================================

INSERT INTO certifications_catalog (body_id, code, name, type, category, level, description, eligibility_criteria, benefits, validity_period_months, official_fee, our_fee, has_exam, has_training, training_hours, is_popular) VALUES

-- DESTINATION SPECIALIST PROGRAMS
((SELECT id FROM certification_bodies WHERE code = 'DET'), 'DUBAI-EXPERT', 'Dubai Expert Agent', 'certification', 'destination', 'intermediate',
'Official Dubai Department of Tourism certification for Dubai specialists',
'{"min_education": "12th Pass"}',
ARRAY['Official Dubai Expert badge', 'Priority FAM trips', 'Dubai tourism updates', 'Trade show invites'],
24, 0, 2999, true, true, 10, true),

((SELECT id FROM certification_bodies WHERE code = 'SGTB'), 'SG-SPECIALIST', 'Singapore Specialist', 'certification', 'destination', 'intermediate',
'Singapore Tourism Board certified destination specialist',
'{"min_education": "12th Pass"}',
ARRAY['SG Specialist badge', 'Free e-learning', 'Singapore promotions', 'Trade updates'],
24, 0, 2499, true, true, 8, true),

((SELECT id FROM certification_bodies WHERE code = 'TAT'), 'THAILAND-EXPERT', 'Thailand Travel Expert', 'certification', 'destination', 'intermediate',
'TAT certified Thailand destination specialist',
'{"min_education": "12th Pass"}',
ARRAY['TAT certification', 'Thai tourism updates', 'Trade events access', 'FAM trip priority'],
24, 0, 1999, true, true, 6, true),

((SELECT id FROM certification_bodies WHERE code = 'MYT'), 'MALAYSIA-SPECIALIST', 'Malaysia Tourism Specialist', 'certification', 'destination', 'intermediate',
'Tourism Malaysia certified specialist',
'{"min_education": "12th Pass"}',
ARRAY['Malaysia Specialist badge', 'Trade partner benefits', 'Destination updates', 'FAM eligibility'],
24, 0, 1999, true, true, 6, false),

((SELECT id FROM certification_bodies WHERE code = 'ATE'), 'AUSSIE-SPECIALIST', 'Aussie Specialist', 'certification', 'destination', 'intermediate',
'Tourism Australia official Aussie Specialist certification',
'{"min_education": "12th Pass"}',
ARRAY['Aussie Specialist badge', 'Premier program access', 'Marketing tools', 'FAM trips'],
24, 0, 3499, true, true, 12, true),

((SELECT id FROM certification_bodies WHERE code = 'NZT'), 'KIWI-SPECIALIST', 'Kiwi Specialist', 'certification', 'destination', 'intermediate',
'Tourism New Zealand Kiwi Specialist program',
'{"min_education": "12th Pass"}',
ARRAY['Kiwi Specialist badge', 'New Zealand expertise', 'Trade support', 'FAM opportunities'],
24, 0, 3499, true, true, 10, false),

((SELECT id FROM certification_bodies WHERE code = 'VJ'), 'JAPAN-SPECIALIST', 'Japan Travel Specialist', 'certification', 'destination', 'intermediate',
'JNTO Japan destination specialist certification',
'{"min_education": "12th Pass"}',
ARRAY['Japan Specialist', 'Cultural expertise', 'JR Pass knowledge', 'Trade events'],
24, 0, 3999, true, true, 15, true),

((SELECT id FROM certification_bodies WHERE code = 'VB'), 'BRITAIN-EXPERT', 'Britain Expert', 'certification', 'destination', 'intermediate',
'VisitBritain certified Britain travel expert',
'{"min_education": "12th Pass"}',
ARRAY['Britain Expert badge', 'UK tourism updates', 'Trade events', 'Sales tools'],
24, 0, 2999, true, true, 10, true),

((SELECT id FROM certification_bodies WHERE code = 'SNTO'), 'SWISS-EXPERT', 'Switzerland Travel Expert', 'certification', 'destination', 'intermediate',
'Switzerland Tourism certified travel expert',
'{"min_education": "12th Pass"}',
ARRAY['Swiss Expert badge', 'Alpine expertise', 'Trade events', 'Marketing support'],
24, 0, 3999, true, true, 12, false),

((SELECT id FROM certification_bodies WHERE code = 'STC'), 'FUNDI-EXPERT', 'Fundi Travel Expert', 'certification', 'destination', 'intermediate',
'South African Tourism Fundi Program certification',
'{"min_education": "12th Pass"}',
ARRAY['Fundi badge', 'Safari expertise', 'South Africa products', 'Trade support'],
24, 0, 2999, true, true, 8, false),

-- HOTEL SPECIALIST CERTIFICATIONS
((SELECT id FROM certification_bodies WHERE code = 'MARRIOTT'), 'MARRIOTT-SPECIALIST', 'Marriott Bonvoy Specialist', 'certification', 'specialized', 'intermediate',
'Marriott hotel portfolio specialist certification',
'{"min_education": "12th Pass", "min_experience_months": 6}',
ARRAY['Marriott certified', 'Portfolio knowledge', 'Booking tools', 'Bonus eligibility'],
12, 0, 1999, true, true, 5, true),

((SELECT id FROM certification_bodies WHERE code = 'HILTON'), 'HILTON-SPECIALIST', 'Hilton Travel Professional', 'certification', 'specialized', 'intermediate',
'Hilton hotels specialist certification',
'{"min_education": "12th Pass", "min_experience_months": 6}',
ARRAY['Hilton certified', 'Property knowledge', 'Booking perks', 'Bonus program'],
12, 0, 1999, true, true, 5, true),

((SELECT id FROM certification_bodies WHERE code = 'IHG'), 'IHG-SPECIALIST', 'IHG Certified Specialist', 'certification', 'specialized', 'intermediate',
'IHG hotel brands specialist certification',
'{"min_education": "12th Pass"}',
ARRAY['IHG certified', 'Brand expertise', 'Sales tools', 'Rewards program'],
12, 0, 1499, true, true, 4, false),

((SELECT id FROM certification_bodies WHERE code = 'ACCOR'), 'ACCOR-EXPERT', 'Accor Travel Expert', 'certification', 'specialized', 'intermediate',
'Accor hotels portfolio expert certification',
'{"min_education": "12th Pass"}',
ARRAY['Accor certified', 'ALL brands knowledge', 'Trade rates', 'Loyalty benefits'],
12, 0, 1499, true, true, 4, false),

-- CRUISE SPECIALIST CERTIFICATIONS
((SELECT id FROM certification_bodies WHERE code = 'RCCL'), 'RCCL-EXPERT', 'Royal Caribbean Expert', 'certification', 'specialized', 'intermediate',
'Royal Caribbean cruise specialist certification',
'{"min_education": "12th Pass", "min_experience_months": 6}',
ARRAY['RCI Expert badge', 'Cruise knowledge', 'Booking tools', 'Commission boost'],
12, 0, 2499, true, true, 8, true),

((SELECT id FROM certification_bodies WHERE code = 'CCL'), 'CARNIVAL-SPECIALIST', 'Carnival Cruise Specialist', 'certification', 'specialized', 'intermediate',
'Carnival cruise lines specialist certification',
'{"min_education": "12th Pass"}',
ARRAY['Carnival certified', 'Product expertise', 'Sales tools', 'Incentives'],
12, 0, 2499, true, true, 8, false),

((SELECT id FROM certification_bodies WHERE code = 'NCL'), 'NCL-SPECIALIST', 'Norwegian Cruise Specialist', 'certification', 'specialized', 'intermediate',
'Norwegian Cruise Line specialist certification',
'{"min_education": "12th Pass"}',
ARRAY['NCL certified', 'Freestyle knowledge', 'Booking perks', 'FAM cruises'],
12, 0, 2499, true, true, 6, false),

((SELECT id FROM certification_bodies WHERE code = 'MSC'), 'MSC-SPECIALIST', 'MSC Cruise Specialist', 'certification', 'specialized', 'intermediate',
'MSC Cruises certified specialist',
'{"min_education": "12th Pass"}',
ARRAY['MSC certified', 'Mediterranean expertise', 'Sales tools', 'Commission bonuses'],
12, 0, 2499, true, true, 6, false),

-- AIRLINE SPECIALIST CERTIFICATIONS
((SELECT id FROM certification_bodies WHERE code = 'EMIRATES'), 'EMIRATES-SPECIALIST', 'Emirates Travel Specialist', 'certification', 'specialized', 'intermediate',
'Emirates airline product specialist',
'{"min_education": "12th Pass", "min_experience_months": 6}',
ARRAY['Emirates certified', 'Product knowledge', 'Sales tools', 'FAM trips'],
12, 0, 2999, true, true, 8, true),

((SELECT id FROM certification_bodies WHERE code = 'SQ'), 'SQ-SPECIALIST', 'Singapore Airlines Specialist', 'certification', 'specialized', 'intermediate',
'Singapore Airlines certified specialist',
'{"min_education": "12th Pass", "min_experience_months": 6}',
ARRAY['SQ certified', 'Premium expertise', 'Sales support', 'Incentive access'],
12, 0, 2999, true, true, 6, true),

((SELECT id FROM certification_bodies WHERE code = 'QR'), 'QR-SPECIALIST', 'Qatar Airways Specialist', 'certification', 'specialized', 'intermediate',
'Qatar Airways product specialist certification',
'{"min_education": "12th Pass", "min_experience_months": 6}',
ARRAY['QR certified', 'Doha hub knowledge', 'Sales tools', 'Trade events'],
12, 0, 2999, true, true, 6, false),

-- PROFESSIONAL CERTIFICATIONS
((SELECT id FROM certification_bodies WHERE code = 'TTI'), 'CTC-CERT', 'Certified Travel Counselor (CTC)', 'certification', 'travel_agent', 'advanced',
'Advanced travel professional certification - global recognition',
'{"min_education": "Graduate", "min_experience_months": 60}',
ARRAY['Global recognition', 'Elite status', 'Industry credibility', 'Higher earnings'],
NULL, 65000, 59999, true, true, 80, true),

((SELECT id FROM certification_bodies WHERE code = 'TTI'), 'CTA-CERT', 'Certified Travel Associate (CTA)', 'certification', 'travel_agent', 'intermediate',
'Entry-level professional travel certification',
'{"min_education": "12th Pass", "min_experience_months": 12}',
ARRAY['Professional credential', 'Industry foundation', 'Career advancement', 'Skill validation'],
NULL, 35000, 29999, true, true, 40, true),

((SELECT id FROM certification_bodies WHERE code = 'GBTA'), 'GTP-CERT', 'Global Travel Professional (GTP)', 'certification', 'specialized', 'advanced',
'Corporate and business travel professional certification',
'{"min_education": "Graduate", "min_experience_months": 36}',
ARRAY['Corporate travel expertise', 'TMC knowledge', 'Policy compliance', 'Expense management'],
24, 55000, 49999, true, true, 60, false),

((SELECT id FROM certification_bodies WHERE code = 'SITE'), 'CIS-CERT', 'Certified Incentive Specialist', 'certification', 'specialized', 'advanced',
'Incentive travel and events specialist certification',
'{"min_education": "Graduate", "min_experience_months": 24}',
ARRAY['Incentive travel expert', 'MICE knowledge', 'Event planning', 'Premium clients'],
24, 45000, 39999, true, true, 40, false),

((SELECT id FROM certification_bodies WHERE code = 'MPI'), 'CMP-CERT', 'Certified Meeting Professional', 'certification', 'specialized', 'advanced',
'Meeting and event professional certification',
'{"min_education": "Graduate", "min_experience_months": 36}',
ARRAY['Meeting expertise', 'Event management', 'MICE industry', 'Global recognition'],
24, 55000, 49999, true, true, 50, false),

-- INDIAN REGIONAL ASSOCIATION MEMBERSHIPS
((SELECT id FROM certification_bodies WHERE code = 'RATO'), 'RATO-MEMBER', 'RATO Active Membership', 'membership', 'tour_operator', 'foundation',
'Rajasthan Association of Tour Operators membership',
'{"min_experience_months": 12, "state": "Rajasthan"}',
ARRAY['Rajasthan network', 'Heritage tourism', 'Regional events', 'Business support'],
12, 8000, 9999, false, false, 0, false),

((SELECT id FROM certification_bodies WHERE code = 'KATA'), 'KATA-MEMBER', 'KATA Active Membership', 'membership', 'travel_agent', 'foundation',
'Kerala Association of Travel Agents membership',
'{"min_experience_months": 12, "state": "Kerala"}',
ARRAY['Kerala network', 'Backwater expertise', 'Ayurveda tourism', 'Trade events'],
12, 7500, 8999, false, false, 0, false),

((SELECT id FROM certification_bodies WHERE code = 'GATO'), 'GATO-MEMBER', 'GATO Active Membership', 'membership', 'tour_operator', 'foundation',
'Goa Association of Tour Operators membership',
'{"min_experience_months": 12, "state": "Goa"}',
ARRAY['Goa tourism network', 'Beach tourism', 'Charter expertise', 'Trade support'],
12, 6000, 7499, false, false, 0, false),

((SELECT id FROM certification_bodies WHERE code = 'UTTOA'), 'UTTOA-MEMBER', 'UTTOA Membership', 'membership', 'tour_operator', 'foundation',
'Uttarakhand Tour Operators Association membership',
'{"min_experience_months": 12, "state": "Uttarakhand"}',
ARRAY['Uttarakhand network', 'Char Dham expertise', 'Adventure tourism', 'Govt liaison'],
12, 5000, 6499, false, false, 0, false),

((SELECT id FROM certification_bodies WHERE code = 'NETOA'), 'NETOA-MEMBER', 'NETOA Membership', 'membership', 'tour_operator', 'foundation',
'North East Tour Operators Association membership',
'{"min_experience_months": 12, "region": "North East"}',
ARRAY['NE India network', 'Ethnic tourism', 'Adventure focus', 'Govt support'],
12, 5000, 6499, false, false, 0, false),

-- SPECIALIZED INDIAN CERTIFICATIONS
((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-HONEYMOON', 'Honeymoon Specialist', 'certification', 'specialized', 'intermediate',
'Certified honeymoon and romance travel specialist',
'{"min_education": "12th Pass", "min_experience_months": 12}',
ARRAY['Romance expertise', 'Destination weddings', 'Premium properties', 'Customization skills'],
24, 8000, 6999, true, true, 20, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-MICE', 'MICE & Events Specialist', 'certification', 'specialized', 'intermediate',
'Meetings, Incentives, Conferences, Exhibitions specialist',
'{"min_education": "Graduate", "min_experience_months": 24}',
ARRAY['MICE expertise', 'Event management', 'Corporate clients', 'Venue knowledge'],
24, 15000, 12999, true, true, 40, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-LUXURY', 'Luxury Travel Specialist', 'certification', 'specialized', 'advanced',
'High-end and luxury travel specialist certification',
'{"min_education": "Graduate", "min_experience_months": 36}',
ARRAY['Luxury expertise', 'HNI clients', 'Premium suppliers', 'Bespoke service'],
24, 20000, 17999, true, true, 30, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-MEDICAL', 'Medical Tourism Specialist', 'certification', 'specialized', 'intermediate',
'Medical and wellness tourism specialist certification',
'{"min_education": "Graduate", "min_experience_months": 12}',
ARRAY['Medical tourism expertise', 'Hospital network', 'Visa support', 'Patient care'],
24, 12000, 9999, true, true, 25, false),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-STUDENT', 'Student Travel Specialist', 'certification', 'specialized', 'intermediate',
'Educational and student group travel specialist',
'{"min_education": "Graduate", "min_experience_months": 12}',
ARRAY['Student groups', 'Educational tours', 'Safety protocols', 'Budget expertise'],
24, 8000, 6999, true, true, 15, false),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-SENIOR', 'Senior Travel Specialist', 'certification', 'specialized', 'intermediate',
'Senior citizen and accessible travel specialist',
'{"min_education": "12th Pass", "min_experience_months": 12}',
ARRAY['Senior care', 'Accessibility', 'Medical support', 'Slow travel'],
24, 6000, 4999, true, true, 12, false),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-PILGRIMAGE', 'Pilgrimage Tourism Specialist', 'certification', 'specialized', 'intermediate',
'Religious and pilgrimage travel specialist',
'{"min_education": "12th Pass", "min_experience_months": 12}',
ARRAY['Religious tourism', 'Multi-faith knowledge', 'Group handling', 'Accommodation expertise'],
24, 6000, 4999, true, true, 15, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-ADVENTURE', 'Adventure Travel Specialist', 'certification', 'specialized', 'intermediate',
'Adventure tourism and outdoor activity specialist',
'{"min_education": "12th Pass", "min_experience_months": 12}',
ARRAY['Adventure expertise', 'Safety protocols', 'Equipment knowledge', 'Outdoor activities'],
24, 10000, 8999, true, true, 25, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-WILDLIFE', 'Wildlife Safari Specialist', 'certification', 'specialized', 'intermediate',
'Wildlife tourism and safari specialist',
'{"min_education": "12th Pass", "min_experience_months": 12}',
ARRAY['Wildlife expertise', 'National parks', 'Safari planning', 'Conservation awareness'],
24, 8000, 6999, true, true, 20, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-VISA', 'Visa & Immigration Specialist', 'certification', 'specialized', 'intermediate',
'International visa and immigration specialist',
'{"min_education": "Graduate", "min_experience_months": 24}',
ARRAY['Visa expertise', 'Immigration knowledge', 'Documentation', 'Embassy relations'],
24, 12000, 9999, true, true, 30, true),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-FOREX', 'Forex & Travel Insurance Specialist', 'certification', 'specialized', 'intermediate',
'Foreign exchange and travel insurance expert',
'{"min_education": "12th Pass", "min_experience_months": 12}',
ARRAY['Forex expertise', 'Insurance products', 'Claims handling', 'Compliance knowledge'],
24, 8000, 6999, true, true, 15, false),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-RAIL', 'Rail Travel Specialist', 'certification', 'specialized', 'foundation',
'Railway travel and luxury train specialist (India & International)',
'{"min_education": "12th Pass"}',
ARRAY['Rail expertise', 'IRCTC knowledge', 'Luxury trains', 'International rail'],
24, 5000, 3999, true, true, 12, false),

((SELECT id FROM certification_bodies WHERE code = 'TRIPCODE'), 'TC-DIGITAL', 'Digital Travel Marketing', 'certification', 'specialized', 'intermediate',
'Digital marketing for travel businesses',
'{"min_education": "Graduate", "min_experience_months": 12}',
ARRAY['Digital marketing', 'Social media', 'SEO/SEM', 'Online presence'],
24, 15000, 12999, true, true, 35, true);

-- =====================================================
-- CREATE COURSE CATEGORIES
-- =====================================================

INSERT INTO course_categories (name, slug, description, icon, display_order, is_active) VALUES
('GDS & Reservation Systems', 'gds-reservations', 'Learn global distribution systems and reservation technologies', 'globe', 1, true),
('IATA Certifications', 'iata-certifications', 'Official IATA foundation and advanced certifications', 'academic-cap', 2, true),
('Destination Specialist', 'destination-specialist', 'Become an expert in specific travel destinations', 'map', 3, true),
('Travel Business', 'travel-business', 'Start and grow your travel business', 'briefcase', 4, true),
('Association Prep', 'association-prep', 'Prepare for industry association memberships', 'users', 5, true),
('Cruise & Luxury', 'cruise-luxury', 'Specialize in cruise and luxury travel', 'sparkles', 6, true),
('Corporate Travel', 'corporate-travel', 'Corporate and business travel management', 'building-office', 7, true),
('Specialized Tourism', 'specialized-tourism', 'Niche tourism segments and specializations', 'star', 8, true),
('Digital & Marketing', 'digital-marketing', 'Digital marketing for travel businesses', 'chart-bar', 9, true),
('Soft Skills', 'soft-skills', 'Customer service and communication skills', 'chat-bubble', 10, true);

-- =====================================================
-- CREATE SAMPLE INSTRUCTORS
-- =====================================================

INSERT INTO instructors (name, email, title, bio, short_bio, expertise_areas, certifications, experience_years, is_featured, is_active) VALUES
('Rajesh Kumar', 'rajesh@tripcode.in', 'Senior Travel Industry Trainer',
'With over 20 years in the travel industry, Rajesh has trained 5000+ travel agents across India. Former IATA training manager with expertise in GDS systems and fare construction.',
'20+ years in travel industry, IATA certified trainer',
ARRAY['IATA Training', 'GDS Systems', 'Fare Construction', 'Travel Consulting'],
ARRAY['IATA Certified Trainer', 'Amadeus Master', 'Sabre Expert'],
20, true, true),

('Priya Sharma', 'priya@tripcode.in', 'Destination Specialist Trainer',
'Priya has visited 50+ countries and specializes in destination training. She leads our destination specialist programs for Dubai, Europe, and Southeast Asia.',
'50+ countries visited, destination expert',
ARRAY['Destination Training', 'Dubai Expert', 'Europe Specialist', 'SEA Expert'],
ARRAY['Dubai Expert Agent', 'Aussie Specialist', 'CLIA Cruise Counsellor'],
12, true, true),

('Amit Patel', 'amit@tripcode.in', 'GDS Systems Expert',
'Amit is our GDS guru with expertise in Amadeus, Sabre, and Galileo. He has trained agents from 500+ agencies on various GDS platforms.',
'GDS expert, 500+ agencies trained',
ARRAY['Amadeus', 'Sabre', 'Galileo', 'GDS Integration'],
ARRAY['Amadeus Certified Trainer', 'Sabre Expert', 'Travelport Certified'],
15, false, true),

('Sunita Mehta', 'sunita@tripcode.in', 'Cruise & Luxury Travel Specialist',
'Sunita is our cruise and luxury travel expert with experience working with premium cruise lines and luxury travel brands.',
'Cruise and luxury travel specialist',
ARRAY['Cruise Sales', 'Luxury Travel', 'High-Net-Worth Clients', 'Premium Products'],
ARRAY['CLIA Master Cruise Counsellor', 'Virtuoso Advisor'],
10, true, true),

('Vikram Singh', 'vikram@tripcode.in', 'Travel Business Coach',
'Vikram is a successful travel entrepreneur and business coach who has helped 200+ agents start their travel businesses.',
'Travel business coach, 200+ startups mentored',
ARRAY['Business Setup', 'IATA Accreditation', 'Marketing', 'Operations'],
ARRAY['TAFI Member', 'IATO Member', 'MBA Tourism'],
18, false, true);
