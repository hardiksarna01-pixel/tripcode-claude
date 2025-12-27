/**
 * PDF Generation Service
 * Generates ticket PDFs, invoices, etc.
 */

class PdfService {
    constructor() {
        this.companyDetails = {
            name: process.env.COMPANY_NAME || 'Flyshop.in',
            phone: process.env.COMPANY_PHONE || '9218501850',
            email: process.env.COMPANY_EMAIL || 'support@flyshop.in',
            website: 'www.flyshop.in'
        };
    }

    /**
     * Generate E-Ticket PDF
     */
    async generateTicketPdf(booking, agent) {
        const html = this.generateTicketHtml(booking, agent);
        
        // In production, use puppeteer to convert HTML to PDF
        return {
            html,
            filename: `Ticket_${booking.bookingRefNo}.pdf`
        };
    }

    /**
     * Generate E-Ticket HTML
     */
    generateTicketHtml(booking, agent) {
        const passengers = booking.passengers || [];
        const segments = booking.segments || [];
        
        const passengerRows = passengers.map((p, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${p.title} ${p.firstName} ${p.lastName}</td>
                <td>${p.paxType === 0 ? 'Adult' : p.paxType === 1 ? 'Child' : 'Infant'}</td>
                <td>${p.ticketNumber || '-'}</td>
            </tr>
        `).join('');

        const segmentBlocks = segments.map(seg => `
            <div style="background:#f5f5f5;padding:15px;margin:10px 0;border-radius:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                    <strong>${seg.airlineCode} ${seg.flightNumber}</strong>
                    <span>${seg.fareClass || 'Economy'}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:bold;">${seg.origin}</div>
                        <div style="font-size:18px;">${this.formatTime(seg.departureDateTime)}</div>
                        <div style="font-size:11px;color:#666;">${this.formatDate(seg.departureDateTime)}</div>
                    </div>
                    <div style="flex:1;text-align:center;">
                        <div style="font-size:11px;color:#666;">${seg.duration}</div>
                        <div style="border-top:2px dashed #999;margin:10px 20px;"></div>
                        <div style="font-size:10px;">✈️ Non-stop</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:bold;">${seg.destination}</div>
                        <div style="font-size:18px;">${this.formatTime(seg.arrivalDateTime)}</div>
                        <div style="font-size:11px;color:#666;">${this.formatDate(seg.arrivalDateTime)}</div>
                    </div>
                </div>
            </div>
        `).join('');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>E-Ticket - ${booking.bookingRefNo}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #1a73e8; padding-bottom: 15px; margin-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #1a73e8; }
        .ticket-type { background: #4caf50; color: white; padding: 5px 15px; border-radius: 4px; font-size: 14px; }
        .booking-strip { display: flex; justify-content: space-around; background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .booking-strip div { text-align: center; }
        .booking-strip .label { font-size: 10px; color: #666; text-transform: uppercase; }
        .booking-strip .value { font-size: 16px; font-weight: bold; margin-top: 5px; }
        .pnr { background: #1a73e8; color: white; padding: 8px 20px; border-radius: 4px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 14px; font-weight: bold; color: #1a73e8; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; font-size: 10px; text-transform: uppercase; }
        .terms { font-size: 9px; color: #666; margin-top: 20px; padding: 10px; background: #fafafa; border-radius: 4px; }
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">${this.companyDetails.name}</div>
        <div>
            <span class="ticket-type">E-TICKET</span>
        </div>
    </div>

    <div class="booking-strip">
        <div>
            <div class="label">Booking Reference</div>
            <div class="value">${booking.bookingRefNo}</div>
        </div>
        <div>
            <div class="label">Airline PNR</div>
            <div class="value pnr">${booking.airlinePnr}</div>
        </div>
        <div>
            <div class="label">Booking Date</div>
            <div class="value">${this.formatDate(booking.bookingDate)}</div>
        </div>
        <div>
            <div class="label">Status</div>
            <div class="value" style="color:#4caf50;">CONFIRMED</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Flight Details</div>
        ${segmentBlocks}
    </div>

    <div class="section">
        <div class="section-title">Passenger Details</div>
        <table>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Passenger Name</th>
                    <th>Type</th>
                    <th>Ticket Number</th>
                </tr>
            </thead>
            <tbody>
                ${passengerRows}
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Fare Details</div>
        <table>
            <tr><td>Base Fare</td><td style="text-align:right;">₹ ${(booking.baseFare || 0).toLocaleString()}</td></tr>
            <tr><td>Taxes & Fees</td><td style="text-align:right;">₹ ${(booking.taxes || 0).toLocaleString()}</td></tr>
            <tr style="font-weight:bold;background:#f5f5f5;">
                <td>Total Amount</td>
                <td style="text-align:right;">₹ ${(booking.grossAmount || 0).toLocaleString()}</td>
            </tr>
        </table>
    </div>

    <div class="terms">
        <strong>Important Information:</strong>
        <ul style="margin-left:15px;margin-top:5px;">
            <li>Please carry a valid photo ID proof along with this e-ticket.</li>
            <li>Web check-in opens 48 hours before departure.</li>
            <li>Report to the airport at least 2 hours before departure for domestic flights.</li>
            <li>Baggage allowance: Check-in ${booking.baggage || '15 KG'}, Cabin 7 KG.</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>${this.companyDetails.name}</strong></p>
        <p>${this.companyDetails.email} | ${this.companyDetails.phone} | ${this.companyDetails.website}</p>
        <p style="margin-top:10px;">This is a computer generated document and does not require signature.</p>
    </div>
</body>
</html>`;
    }

    /**
     * Generate Invoice HTML
     */
    generateInvoiceHtml(booking, agent) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice - ${booking.invoiceNumber || booking.bookingRefNo}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info { font-size: 10px; color: #666; }
        .invoice-title { font-size: 28px; color: #1a73e8; }
        .invoice-details { text-align: right; }
        .billing-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .billing-box { width: 45%; }
        .billing-box h4 { margin-bottom: 10px; color: #1a73e8; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #1a73e8; color: white; }
        .totals { width: 300px; margin-left: auto; }
        .totals td { border: none; padding: 5px 10px; }
        .totals .grand-total { font-size: 16px; font-weight: bold; background: #f5f5f5; }
        .footer { text-align: center; margin-top: 50px; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div style="font-size:24px;font-weight:bold;color:#1a73e8;">${this.companyDetails.name}</div>
            <div class="company-info">
                ${this.companyDetails.email}<br>
                ${this.companyDetails.phone}
            </div>
        </div>
        <div class="invoice-details">
            <div class="invoice-title">INVOICE</div>
            <div><strong>Invoice #:</strong> ${booking.invoiceNumber || booking.bookingRefNo}</div>
            <div><strong>Date:</strong> ${this.formatDate(booking.bookingDate)}</div>
            <div><strong>PNR:</strong> ${booking.airlinePnr}</div>
        </div>
    </div>

    <div class="billing-info">
        <div class="billing-box">
            <h4>Bill To:</h4>
            <strong>${agent.companyName || agent.contactPerson}</strong><br>
            ${agent.address || ''}<br>
            ${agent.city || ''}, ${agent.state || ''} ${agent.pincode || ''}<br>
            GST: ${agent.gstNumber || 'N/A'}
        </div>
        <div class="billing-box">
            <h4>Booking Details:</h4>
            <strong>Ref:</strong> ${booking.bookingRefNo}<br>
            <strong>Route:</strong> ${booking.segments?.[0]?.origin} - ${booking.segments?.[booking.segments.length-1]?.destination}<br>
            <strong>Travel Date:</strong> ${this.formatDate(booking.segments?.[0]?.departureDateTime)}<br>
            <strong>Passengers:</strong> ${booking.passengers?.length || 0}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align:right;">Amount (₹)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Base Fare (${booking.adultCount || 1} Adult)</td>
                <td style="text-align:right;">${(booking.baseFare || 0).toLocaleString()}</td>
            </tr>
            <tr>
                <td>Taxes & Surcharges</td>
                <td style="text-align:right;">${(booking.taxes || 0).toLocaleString()}</td>
            </tr>
            <tr>
                <td>Service Fee</td>
                <td style="text-align:right;">${(booking.serviceFee || 0).toLocaleString()}</td>
            </tr>
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td>Subtotal</td>
            <td style="text-align:right;">₹ ${((booking.baseFare || 0) + (booking.taxes || 0)).toLocaleString()}</td>
        </tr>
        <tr>
            <td>Service Fee</td>
            <td style="text-align:right;">₹ ${(booking.serviceFee || 0).toLocaleString()}</td>
        </tr>
        <tr>
            <td>Commission</td>
            <td style="text-align:right;">- ₹ ${(booking.agentCommission || 0).toLocaleString()}</td>
        </tr>
        <tr class="grand-total">
            <td>Net Payable</td>
            <td style="text-align:right;">₹ ${(booking.netAmount || 0).toLocaleString()}</td>
        </tr>
    </table>

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>${this.companyDetails.name} | ${this.companyDetails.website}</p>
    </div>
</body>
</html>`;
    }

    formatDate(date) {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    }

    formatTime(date) {
        if (!date) return '-';
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', hour12: false
        });
    }
}

module.exports = new PdfService();
