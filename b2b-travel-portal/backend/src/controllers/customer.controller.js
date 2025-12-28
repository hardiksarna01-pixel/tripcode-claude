/**
 * Customer Controller
 * Handles customer/traveler management (CRM)
 */

const catchAsync = require('../utils/catchAsync');

// In-memory storage for demo (would be database in production)
let customers = new Map();
let customerIdCounter = 1;

/**
 * Get all customers for agent
 */
exports.getCustomers = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { search, page = 1, limit = 20, sortBy = 'name', order = 'asc' } = req.query;

    let agentCustomers = Array.from(customers.values()).filter(c => c.agentId === agentId);

    // Search filter
    if (search) {
        const searchLower = search.toLowerCase();
        agentCustomers = agentCustomers.filter(c =>
            c.firstName.toLowerCase().includes(searchLower) ||
            c.lastName.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            c.phone.includes(search)
        );
    }

    // Sort
    agentCustomers.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
            case 'name':
                comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                break;
            case 'bookings':
                comparison = (b.bookingCount || 0) - (a.bookingCount || 0);
                break;
            case 'lastBooking':
                comparison = new Date(b.lastBookingDate || 0) - new Date(a.lastBookingDate || 0);
                break;
            default:
                comparison = 0;
        }
        return order === 'desc' ? -comparison : comparison;
    });

    // Paginate
    const offset = (page - 1) * limit;
    const paginatedCustomers = agentCustomers.slice(offset, offset + parseInt(limit));

    res.json({
        success: true,
        data: {
            customers: paginatedCustomers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: agentCustomers.length,
                totalPages: Math.ceil(agentCustomers.length / limit)
            }
        }
    });
});

/**
 * Get single customer by ID
 */
exports.getCustomer = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const customer = customers.get(parseInt(id));

    if (!customer || customer.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Customer not found'
        });
    }

    res.json({
        success: true,
        data: customer
    });
});

/**
 * Create new customer
 */
exports.createCustomer = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const customerData = req.body;

    // Validate required fields
    if (!customerData.firstName || !customerData.lastName) {
        return res.status(400).json({
            success: false,
            error: 'First name and last name are required'
        });
    }

    const customer = {
        id: customerIdCounter++,
        agentId,
        title: customerData.title || 'Mr',
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email || '',
        phone: customerData.phone || '',
        dateOfBirth: customerData.dateOfBirth || null,
        gender: customerData.gender || 'M',
        nationality: customerData.nationality || 'IN',

        // Document details
        passportNumber: customerData.passportNumber || '',
        passportExpiry: customerData.passportExpiry || null,
        passportCountry: customerData.passportCountry || 'IN',

        // Preferences
        preferredSeat: customerData.preferredSeat || 'window',
        mealPreference: customerData.mealPreference || 'regular',
        specialAssistance: customerData.specialAssistance || [],
        frequentFlyerPrograms: customerData.frequentFlyerPrograms || [],

        // GST Details
        gstNumber: customerData.gstNumber || '',
        gstCompanyName: customerData.gstCompanyName || '',
        gstAddress: customerData.gstAddress || '',

        // Stats
        bookingCount: 0,
        totalSpent: 0,
        lastBookingDate: null,

        // Flags
        isFrequent: customerData.isFrequent || false,
        isCorporate: customerData.isCorporate || false,
        tags: customerData.tags || [],
        notes: customerData.notes || '',

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    customers.set(customer.id, customer);

    res.status(201).json({
        success: true,
        data: customer
    });
});

/**
 * Update customer
 */
exports.updateCustomer = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;
    const updateData = req.body;

    const customer = customers.get(parseInt(id));

    if (!customer || customer.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Customer not found'
        });
    }

    const updatedCustomer = {
        ...customer,
        ...updateData,
        id: customer.id,
        agentId: customer.agentId,
        createdAt: customer.createdAt,
        updatedAt: new Date().toISOString()
    };

    customers.set(customer.id, updatedCustomer);

    res.json({
        success: true,
        data: updatedCustomer
    });
});

/**
 * Delete customer
 */
exports.deleteCustomer = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const customer = customers.get(parseInt(id));

    if (!customer || customer.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Customer not found'
        });
    }

    customers.delete(parseInt(id));

    res.json({
        success: true,
        message: 'Customer deleted successfully'
    });
});

/**
 * Get customer booking history
 */
exports.getCustomerBookings = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const customer = customers.get(parseInt(id));

    if (!customer || customer.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Customer not found'
        });
    }

    // This would query bookings in production
    // For demo, returning empty array
    res.json({
        success: true,
        data: {
            bookings: [],
            totalSpent: customer.totalSpent || 0,
            bookingCount: customer.bookingCount || 0
        }
    });
});

/**
 * Search customers (quick search)
 */
exports.searchCustomers = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
        return res.json({
            success: true,
            data: []
        });
    }

    const searchLower = q.toLowerCase();
    const results = Array.from(customers.values())
        .filter(c =>
            c.agentId === agentId && (
                c.firstName.toLowerCase().includes(searchLower) ||
                c.lastName.toLowerCase().includes(searchLower) ||
                c.email.toLowerCase().includes(searchLower) ||
                c.phone.includes(q)
            )
        )
        .slice(0, parseInt(limit))
        .map(c => ({
            id: c.id,
            name: `${c.title} ${c.firstName} ${c.lastName}`,
            email: c.email,
            phone: c.phone,
            isFrequent: c.isFrequent
        }));

    res.json({
        success: true,
        data: results
    });
});

/**
 * Import customers from CSV/Excel
 */
exports.importCustomers = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { customers: customerList } = req.body;

    if (!Array.isArray(customerList) || customerList.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No customers provided'
        });
    }

    const imported = [];
    const errors = [];

    for (let i = 0; i < customerList.length; i++) {
        const data = customerList[i];

        if (!data.firstName || !data.lastName) {
            errors.push({ row: i + 1, error: 'Missing required fields' });
            continue;
        }

        const customer = {
            id: customerIdCounter++,
            agentId,
            title: data.title || 'Mr',
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || '',
            phone: data.phone || '',
            dateOfBirth: data.dateOfBirth || null,
            gender: data.gender || 'M',
            nationality: data.nationality || 'IN',
            passportNumber: data.passportNumber || '',
            passportExpiry: data.passportExpiry || null,
            preferredSeat: 'window',
            mealPreference: 'regular',
            specialAssistance: [],
            frequentFlyerPrograms: [],
            bookingCount: 0,
            totalSpent: 0,
            isFrequent: false,
            isCorporate: false,
            tags: [],
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        customers.set(customer.id, customer);
        imported.push(customer);
    }

    res.json({
        success: true,
        data: {
            imported: imported.length,
            errors: errors.length,
            errorDetails: errors
        }
    });
});

/**
 * Get frequent travelers
 */
exports.getFrequentTravelers = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;

    const frequentTravelers = Array.from(customers.values())
        .filter(c => c.agentId === agentId && (c.isFrequent || c.bookingCount >= 5))
        .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
        .slice(0, 20);

    res.json({
        success: true,
        data: frequentTravelers
    });
});
