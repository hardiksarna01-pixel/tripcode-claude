/**
 * Invoice Controller
 * Handles invoice generation and GST management
 */

const catchAsync = require('../utils/catchAsync');

// In-memory storage for demo
let invoices = new Map();
let invoiceIdCounter = 1;

/**
 * Generate invoice for booking
 */
exports.generateInvoice = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { bookingRef, customerDetails, gstDetails, includeBreakdown = true } = req.body;

    if (!bookingRef) {
        return res.status(400).json({
            success: false,
            error: 'Booking reference is required'
        });
    }

    const invoiceNumber = `INV${Date.now().toString().slice(-8)}`;

    const invoice = {
        id: invoiceIdCounter++,
        invoiceNumber,
        agentId,
        bookingRef,

        // Customer details
        customerName: customerDetails?.name || 'Guest Customer',
        customerEmail: customerDetails?.email || '',
        customerPhone: customerDetails?.phone || '',
        customerAddress: customerDetails?.address || '',

        // GST details
        hasGst: !!gstDetails?.gstNumber,
        gstNumber: gstDetails?.gstNumber || '',
        gstCompanyName: gstDetails?.companyName || '',
        gstAddress: gstDetails?.address || '',
        gstState: gstDetails?.state || '',
        gstStateCode: gstDetails?.stateCode || '',

        // Invoice amounts (sample data)
        baseFare: 10000,
        taxes: {
            yq: 500,
            yr: 200,
            k3: 150,
            psc: 300,
            udf: 200,
            cgst: gstDetails?.gstNumber ? 450 : 0,
            sgst: gstDetails?.gstNumber ? 450 : 0,
            igst: 0
        },
        serviceFee: 250,
        convenienceFee: 100,
        discount: 0,

        // Totals
        subTotal: 11700,
        totalTax: 1800,
        grandTotal: 13500,

        // Metadata
        includeBreakdown,
        status: 'generated',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    invoices.set(invoice.id, invoice);

    res.status(201).json({
        success: true,
        data: invoice
    });
});

/**
 * Get invoice by ID
 */
exports.getInvoice = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const invoice = invoices.get(parseInt(id));

    if (!invoice || invoice.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Invoice not found'
        });
    }

    res.json({
        success: true,
        data: invoice
    });
});

/**
 * Get invoice by booking reference
 */
exports.getInvoiceByBooking = catchAsync(async (req, res) => {
    const { bookingRef } = req.params;
    const agentId = req.user.agentId;

    const invoice = Array.from(invoices.values()).find(
        inv => inv.bookingRef === bookingRef && inv.agentId === agentId
    );

    if (!invoice) {
        return res.status(404).json({
            success: false,
            error: 'Invoice not found for this booking'
        });
    }

    res.json({
        success: true,
        data: invoice
    });
});

/**
 * Get all invoices for agent
 */
exports.getInvoices = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { page = 1, limit = 20, startDate, endDate, hasGst } = req.query;

    let agentInvoices = Array.from(invoices.values()).filter(inv => inv.agentId === agentId);

    // Apply filters
    if (startDate) {
        agentInvoices = agentInvoices.filter(inv => new Date(inv.createdAt) >= new Date(startDate));
    }
    if (endDate) {
        agentInvoices = agentInvoices.filter(inv => new Date(inv.createdAt) <= new Date(endDate));
    }
    if (hasGst !== undefined) {
        agentInvoices = agentInvoices.filter(inv => inv.hasGst === (hasGst === 'true'));
    }

    // Sort by date
    agentInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate
    const offset = (page - 1) * limit;
    const paginatedInvoices = agentInvoices.slice(offset, offset + parseInt(limit));

    res.json({
        success: true,
        data: {
            invoices: paginatedInvoices,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: agentInvoices.length,
                totalPages: Math.ceil(agentInvoices.length / limit)
            }
        }
    });
});

/**
 * Download invoice as PDF
 */
exports.downloadInvoice = catchAsync(async (req, res) => {
    const { id } = req.params;
    const agentId = req.user.agentId;

    const invoice = invoices.get(parseInt(id));

    if (!invoice || invoice.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Invoice not found'
        });
    }

    // In production, this would generate actual PDF
    res.json({
        success: true,
        data: {
            message: 'Invoice PDF will be generated',
            invoiceNumber: invoice.invoiceNumber,
            downloadUrl: `/api/v1/invoices/${id}/pdf`
        }
    });
});

/**
 * Send invoice via email
 */
exports.emailInvoice = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    const agentId = req.user.agentId;

    const invoice = invoices.get(parseInt(id));

    if (!invoice || invoice.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Invoice not found'
        });
    }

    const targetEmail = email || invoice.customerEmail;

    if (!targetEmail) {
        return res.status(400).json({
            success: false,
            error: 'Email address is required'
        });
    }

    // In production, this would send actual email
    res.json({
        success: true,
        message: `Invoice sent to ${targetEmail}`
    });
});

/**
 * Get GST summary for period
 */
exports.getGstSummary = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;
    const { startDate, endDate, month, year } = req.query;

    let start, end;
    if (month && year) {
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0);
    } else if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
    } else {
        // Default to current month
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const periodInvoices = Array.from(invoices.values()).filter(inv =>
        inv.agentId === agentId &&
        inv.hasGst &&
        new Date(inv.createdAt) >= start &&
        new Date(inv.createdAt) <= end
    );

    const summary = {
        period: {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        },
        invoiceCount: periodInvoices.length,
        taxableValue: periodInvoices.reduce((sum, inv) => sum + inv.subTotal, 0),
        cgst: periodInvoices.reduce((sum, inv) => sum + (inv.taxes.cgst || 0), 0),
        sgst: periodInvoices.reduce((sum, inv) => sum + (inv.taxes.sgst || 0), 0),
        igst: periodInvoices.reduce((sum, inv) => sum + (inv.taxes.igst || 0), 0),
        totalGst: periodInvoices.reduce((sum, inv) =>
            sum + (inv.taxes.cgst || 0) + (inv.taxes.sgst || 0) + (inv.taxes.igst || 0), 0
        ),
        totalValue: periodInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0)
    };

    res.json({
        success: true,
        data: summary
    });
});

/**
 * Update invoice with GST details
 */
exports.addGstDetails = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { gstNumber, companyName, address, state, stateCode } = req.body;
    const agentId = req.user.agentId;

    const invoice = invoices.get(parseInt(id));

    if (!invoice || invoice.agentId !== agentId) {
        return res.status(404).json({
            success: false,
            error: 'Invoice not found'
        });
    }

    // Update GST details
    invoice.hasGst = true;
    invoice.gstNumber = gstNumber;
    invoice.gstCompanyName = companyName || '';
    invoice.gstAddress = address || '';
    invoice.gstState = state || '';
    invoice.gstStateCode = stateCode || '';

    // Recalculate taxes for GST
    const taxableAmount = invoice.baseFare + invoice.serviceFee;
    if (stateCode === '07') { // Same state (Delhi example)
        invoice.taxes.cgst = Math.round(taxableAmount * 0.09);
        invoice.taxes.sgst = Math.round(taxableAmount * 0.09);
        invoice.taxes.igst = 0;
    } else {
        invoice.taxes.cgst = 0;
        invoice.taxes.sgst = 0;
        invoice.taxes.igst = Math.round(taxableAmount * 0.18);
    }

    invoice.totalTax = invoice.taxes.yq + invoice.taxes.yr + invoice.taxes.k3 +
        invoice.taxes.psc + invoice.taxes.udf + invoice.taxes.cgst +
        invoice.taxes.sgst + invoice.taxes.igst;
    invoice.grandTotal = invoice.subTotal + invoice.taxes.cgst + invoice.taxes.sgst + invoice.taxes.igst;
    invoice.updatedAt = new Date().toISOString();

    invoices.set(invoice.id, invoice);

    res.json({
        success: true,
        data: invoice
    });
});

/**
 * Get saved GST profiles
 */
exports.getGstProfiles = catchAsync(async (req, res) => {
    const agentId = req.user.agentId;

    // Get unique GST profiles from invoices
    const profiles = Array.from(invoices.values())
        .filter(inv => inv.agentId === agentId && inv.hasGst)
        .reduce((acc, inv) => {
            if (!acc.find(p => p.gstNumber === inv.gstNumber)) {
                acc.push({
                    gstNumber: inv.gstNumber,
                    companyName: inv.gstCompanyName,
                    address: inv.gstAddress,
                    state: inv.gstState,
                    stateCode: inv.gstStateCode
                });
            }
            return acc;
        }, []);

    res.json({
        success: true,
        data: profiles
    });
});
