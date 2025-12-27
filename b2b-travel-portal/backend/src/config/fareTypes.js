/**
 * Special Fare Types Configuration
 * Defines all supported special fare categories with their API mappings
 */

const FARE_TYPES = {
    REGULAR: {
        code: 'REGULAR',
        name: 'Regular Fare',
        description: 'Standard fare for all passengers',
        apiParams: {
            seniorCitizen: false,
            studentFare: false,
            defenceFare: false,
            doctorNurseFare: false,
            governmentFare: false
        },
        documentsRequired: [],
        eligibility: 'Available for all passengers',
        discount: null
    },
    STUDENT: {
        code: 'STUDENT',
        name: 'Student Fare',
        description: 'Special discounted fare for students',
        apiParams: {
            seniorCitizen: false,
            studentFare: true,
            defenceFare: false,
            doctorNurseFare: false,
            governmentFare: false
        },
        documentsRequired: ['Valid Student ID', 'University/School ID Card'],
        eligibility: 'Students aged 12-26 years with valid student ID',
        discount: 'Up to 10% off',
        minAge: 12,
        maxAge: 26
    },
    SENIOR_CITIZEN: {
        code: 'SENIOR_CITIZEN',
        name: 'Senior Citizen Fare',
        description: 'Discounted fare for senior citizens',
        apiParams: {
            seniorCitizen: true,
            studentFare: false,
            defenceFare: false,
            doctorNurseFare: false,
            governmentFare: false
        },
        documentsRequired: ['Age Proof (Passport/Aadhar/PAN)'],
        eligibility: 'Passengers aged 60 years and above',
        discount: 'Up to 8% off',
        minAge: 60
    },
    ARMED_FORCES: {
        code: 'ARMED_FORCES',
        name: 'Armed Forces Fare',
        description: 'Special fare for defence personnel',
        apiParams: {
            seniorCitizen: false,
            studentFare: false,
            defenceFare: true,
            doctorNurseFare: false,
            governmentFare: false
        },
        documentsRequired: ['Defence ID Card', 'Service Certificate'],
        eligibility: 'Serving and retired defence personnel',
        discount: 'Up to 15% off',
        branches: ['Army', 'Navy', 'Air Force', 'Coast Guard', 'Paramilitary']
    },
    DOCTOR_NURSE: {
        code: 'DOCTOR_NURSE',
        name: 'Doctor & Nurses Fare',
        description: 'Special fare for healthcare professionals',
        apiParams: {
            seniorCitizen: false,
            studentFare: false,
            defenceFare: false,
            doctorNurseFare: true,
            governmentFare: false
        },
        documentsRequired: ['Medical Council Registration', 'Hospital ID'],
        eligibility: 'Registered doctors, nurses and healthcare workers',
        discount: 'Up to 10% off'
    },
    GOVERNMENT: {
        code: 'GOVERNMENT',
        name: 'Government Employee Fare',
        description: 'Fare for government employees on LTC',
        apiParams: {
            seniorCitizen: false,
            studentFare: false,
            defenceFare: false,
            doctorNurseFare: false,
            governmentFare: true
        },
        documentsRequired: ['Government ID', 'LTC Certificate'],
        eligibility: 'Central and State Government employees',
        discount: 'LTC rates applicable'
    }
};

// Supported fare type codes
const FARE_TYPE_CODES = Object.keys(FARE_TYPES);

// Get fare type by code
const getFareType = (code) => {
    return FARE_TYPES[code] || FARE_TYPES.REGULAR;
};

// Get API params for fare type
const getFareTypeApiParams = (code) => {
    const fareType = getFareType(code);
    return fareType.apiParams;
};

// Validate fare type code
const isValidFareType = (code) => {
    return FARE_TYPE_CODES.includes(code);
};

// Get all fare types for frontend display
const getAllFareTypes = () => {
    return Object.values(FARE_TYPES).map(ft => ({
        code: ft.code,
        name: ft.name,
        description: ft.description,
        eligibility: ft.eligibility,
        discount: ft.discount,
        documentsRequired: ft.documentsRequired
    }));
};

module.exports = {
    FARE_TYPES,
    FARE_TYPE_CODES,
    getFareType,
    getFareTypeApiParams,
    isValidFareType,
    getAllFareTypes
};
