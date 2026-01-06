const axios = require('axios');

/**
 * Notification Service
 * Handles WhatsApp, Email, and SMS notifications
 */
class NotificationService {
    constructor() {
        // WhatsApp Business API config (use providers like Interakt, WATI, Gupshup)
        this.whatsappApiUrl = process.env.WHATSAPP_API_URL;
        this.whatsappApiKey = process.env.WHATSAPP_API_KEY;
        
        // Email config (SendGrid, AWS SES, etc.)
        this.emailApiUrl = process.env.EMAIL_API_URL;
        this.emailApiKey = process.env.EMAIL_API_KEY;
        this.emailFrom = process.env.EMAIL_FROM || 'noreply@flyshop.in';
        
        // SMS config (MSG91, Twilio)
        this.smsApiUrl = process.env.SMS_API_URL;
        this.smsApiKey = process.env.SMS_API_KEY;
        this.smsSenderId = process.env.SMS_SENDER_ID || 'FLYSHP';
    }

    // =====================================================
    // WHATSAPP NOTIFICATIONS
    // =====================================================

    /**
     * Send WhatsApp message with template
     */
    async sendWhatsApp(phoneNumber, templateName, templateParams, mediaUrl = null) {
        try {
            // Format phone number (add country code if needed)
            const formattedPhone = this.formatPhoneNumber(phoneNumber);
            
            const payload = {
                phone: formattedPhone,
                template: templateName,
                parameters: templateParams
            };
            
            if (mediaUrl) {
                payload.mediaUrl = mediaUrl;
            }
            
            const response = await axios.post(
                `${this.whatsappApiUrl}/send-template`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.whatsappApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            return {
                success: true,
                messageId: response.data.messageId,
                status: response.data.status
            };
        } catch (error) {
            console.error('WhatsApp send error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send booking confirmation on WhatsApp with ticket PDF
     */
    async sendBookingConfirmationWhatsApp(booking, agent, ticketPdfUrl) {
        const templateParams = {
            agent_name: agent.contactPerson || agent.companyName,
            booking_ref: booking.bookingRefNo,
            pnr: booking.airlinePnr,
            passenger_name: booking.passengers?.[0]?.firstName + ' ' + booking.passengers?.[0]?.lastName,
            route: `${booking.segments?.[0]?.origin} → ${booking.segments?.[booking.segments.length - 1]?.destination}`,
            travel_date: this.formatDate(booking.segments?.[0]?.departureDateTime),
            flight_number: booking.segments?.[0]?.airlineCode + ' ' + booking.segments?.[0]?.flightNumber,
            amount: `₹${booking.netAmount?.toLocaleString()}`
        };
        
        return await this.sendWhatsApp(
            agent.whatsappNumber || agent.mobile,
            'booking_confirmation', // WhatsApp template name
            templateParams,
            ticketPdfUrl
        );
    }

    /**
     * Send ticket issued notification with PDF
     */
    async sendTicketIssuedWhatsApp(booking, agent, ticketPdfUrl) {
        const templateParams = {
            agent_name: agent.contactPerson || agent.companyName,
            pnr: booking.airlinePnr,
            passenger_names: booking.passengers?.map(p => `${p.firstName} ${p.lastName}`).join(', '),
            flight_details: this.formatFlightDetails(booking.segments),
            ticket_numbers: booking.passengers?.map(p => p.ticketNumber).filter(Boolean).join(', ') || 'See PDF'
        };
        
        return await this.sendWhatsApp(
            agent.whatsappNumber || agent.mobile,
            'ticket_issued',
            templateParams,
            ticketPdfUrl
        );
    }

    /**
     * Send cancellation confirmation
     */
    async sendCancellationWhatsApp(booking, agent, refundAmount) {
        const templateParams = {
            agent_name: agent.contactPerson,
            booking_ref: booking.bookingRefNo,
            pnr: booking.airlinePnr,
            refund_amount: `₹${refundAmount?.toLocaleString()}`,
            cancellation_date: this.formatDate(new Date())
        };
        
        return await this.sendWhatsApp(
            agent.whatsappNumber || agent.mobile,
            'booking_cancelled',
            templateParams
        );
    }

    /**
     * Send agent credentials (on signup approval)
     */
    async sendAgentCredentialsWhatsApp(agent, password) {
        const templateParams = {
            agent_name: agent.contactPerson || agent.companyName,
            agent_code: agent.agentCode,
            email: agent.email,
            password: password,
            login_url: process.env.AGENT_PORTAL_URL || 'https://mypartner.flyshop.in'
        };
        
        return await this.sendWhatsApp(
            agent.whatsappNumber || agent.mobile,
            'agent_credentials',
            templateParams
        );
    }

    /**
     * Send password reset notification
     */
    async sendPasswordResetWhatsApp(agent, newPassword) {
        const templateParams = {
            agent_name: agent.contactPerson,
            new_password: newPassword,
            login_url: process.env.AGENT_PORTAL_URL
        };
        
        return await this.sendWhatsApp(
            agent.whatsappNumber || agent.mobile,
            'password_reset',
            templateParams
        );
    }

    // =====================================================
    // EMAIL NOTIFICATIONS
    // =====================================================

    /**
     * Send email with template
     */
    async sendEmail(to, subject, templateName, templateData, attachments = []) {
        try {
            const htmlContent = this.renderEmailTemplate(templateName, templateData);
            
            const payload = {
                from: this.emailFrom,
                to: to,
                subject: subject,
                html: htmlContent,
                attachments: attachments
            };
            
            // Using SendGrid-style API
            const response = await axios.post(
                `${this.emailApiUrl}/send`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.emailApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            return {
                success: true,
                messageId: response.data.messageId
            };
        } catch (error) {
            console.error('Email send error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send booking confirmation email with ticket PDF
     */
    async sendBookingConfirmationEmail(booking, agent, ticketPdfBuffer) {
        const templateData = {
            agentName: agent.contactPerson || agent.companyName,
            bookingRef: booking.bookingRefNo,
            pnr: booking.airlinePnr,
            passengers: booking.passengers,
            segments: booking.segments,
            fareSummary: {
                baseFare: booking.baseFare,
                taxes: booking.taxes,
                serviceFee: booking.serviceFee,
                netAmount: booking.netAmount
            },
            bookingDate: this.formatDate(booking.bookingDate)
        };
        
        const attachments = [];
        if (ticketPdfBuffer) {
            attachments.push({
                filename: `Ticket_${booking.bookingRefNo}.pdf`,
                content: ticketPdfBuffer.toString('base64'),
                type: 'application/pdf'
            });
        }
        
        return await this.sendEmail(
            agent.email,
            `Booking Confirmed - ${booking.bookingRefNo} | ${booking.airlinePnr}`,
            'booking_confirmation',
            templateData,
            attachments
        );
    }

    /**
     * Send agent welcome email with credentials
     */
    async sendWelcomeEmail(agent, password) {
        const templateData = {
            agentName: agent.contactPerson || agent.companyName,
            agentCode: agent.agentCode,
            email: agent.email,
            password: password,
            loginUrl: process.env.AGENT_PORTAL_URL,
            supportEmail: process.env.SUPPORT_EMAIL || 'support@flyshop.in',
            supportPhone: process.env.SUPPORT_PHONE || '9218501850'
        };
        
        return await this.sendEmail(
            agent.email,
            'Welcome to Flyshop - Your Login Credentials',
            'welcome_agent',
            templateData
        );
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(agent, newPassword) {
        const templateData = {
            agentName: agent.contactPerson,
            newPassword: newPassword,
            loginUrl: process.env.AGENT_PORTAL_URL
        };
        
        return await this.sendEmail(
            agent.email,
            'Password Reset - Flyshop',
            'password_reset',
            templateData
        );
    }

    // =====================================================
    // SMS NOTIFICATIONS
    // =====================================================

    /**
     * Send SMS
     */
    async sendSMS(phoneNumber, message) {
        try {
            const formattedPhone = this.formatPhoneNumber(phoneNumber);
            
            const response = await axios.post(
                `${this.smsApiUrl}/send`,
                {
                    sender: this.smsSenderId,
                    route: '4', // Transactional
                    mobiles: formattedPhone,
                    message: message
                },
                {
                    headers: {
                        'authkey': this.smsApiKey
                    }
                }
            );
            
            return {
                success: true,
                messageId: response.data.messageId
            };
        } catch (error) {
            console.error('SMS send error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send booking confirmation SMS
     */
    async sendBookingConfirmationSMS(booking, agent) {
        const message = `Booking Confirmed! Ref: ${booking.bookingRefNo}, PNR: ${booking.airlinePnr}, ` +
            `${booking.segments?.[0]?.origin}-${booking.segments?.[booking.segments.length - 1]?.destination}, ` +
            `${this.formatDate(booking.segments?.[0]?.departureDateTime)}. ` +
            `Amount: Rs.${booking.netAmount}. -FLYSHOP`;
        
        return await this.sendSMS(agent.mobile, message);
    }

    // =====================================================
    // COMBINED NOTIFICATIONS
    // =====================================================

    /**
     * Send all notifications for booking confirmation
     */
    async sendBookingNotifications(booking, agent, ticketPdfUrl, ticketPdfBuffer) {
        const results = {
            whatsapp: null,
            email: null,
            sms: null
        };
        
        // Send WhatsApp if enabled
        if (agent.receiveWhatsappNotifications) {
            results.whatsapp = await this.sendTicketIssuedWhatsApp(booking, agent, ticketPdfUrl);
        }
        
        // Send Email if enabled
        if (agent.receiveEmailNotifications) {
            results.email = await this.sendBookingConfirmationEmail(booking, agent, ticketPdfBuffer);
        }
        
        // Send SMS if enabled
        if (agent.receiveSmsNotifications) {
            results.sms = await this.sendBookingConfirmationSMS(booking, agent);
        }
        
        return results;
    }

    /**
     * Send agent credentials via all channels
     */
    async sendAgentCredentials(agent, password) {
        const results = {
            whatsapp: null,
            email: null
        };
        
        results.whatsapp = await this.sendAgentCredentialsWhatsApp(agent, password);
        results.email = await this.sendWelcomeEmail(agent, password);
        
        return results;
    }

    /**
     * Send welcome message to newly approved agent
     */
    async sendWelcomeMessage(agent, password) {
        return await this.sendAgentCredentials(agent, password);
    }

    /**
     * Send status change notification
     */
    async sendStatusChangeNotification(agent, newStatus, reason) {
        const statusMessages = {
            SUSPENDED: `Your Flyshop account has been suspended. Reason: ${reason}. Contact support for assistance.`,
            BLOCKED: `Your Flyshop account has been blocked. Reason: ${reason}. Contact support for assistance.`,
            APPROVED: `Great news! Your Flyshop account has been approved. You can now start booking.`
        };
        
        const message = statusMessages[newStatus];
        if (message) {
            await this.sendSMS(agent.mobile, message + ' -FLYSHOP');
        }
    }

    /**
     * Send rejection notification
     */
    async sendRejectionNotification(request, reason) {
        const message = `Your Flyshop registration request has been rejected. Reason: ${reason}. ` +
            `Please contact support for more information. -FLYSHOP`;
        
        await this.sendSMS(request.mobile, message);
    }

    // =====================================================
    // HELPER METHODS
    // =====================================================

    formatPhoneNumber(phone) {
        // Remove any non-digits
        let cleaned = phone.replace(/\D/g, '');
        
        // Add India country code if not present
        if (cleaned.length === 10) {
            cleaned = '91' + cleaned;
        }
        
        return cleaned;
    }

    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    formatFlightDetails(segments) {
        if (!segments || segments.length === 0) return '';
        
        return segments.map(seg => 
            `${seg.airlineCode}${seg.flightNumber} ${seg.origin}-${seg.destination} ` +
            `${this.formatDate(seg.departureDateTime)}`
        ).join(' | ');
    }

    /**
     * Render email template with data
     */
    renderEmailTemplate(templateName, data) {
        // In production, use a proper templating engine like Handlebars, EJS, or Pug
        const templates = {
            booking_confirmation: `
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #1a73e8; color: white; padding: 20px; text-align: center;">
                        <h1>Booking Confirmed ✓</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Dear ${data.agentName},</p>
                        <p>Your booking has been confirmed successfully.</p>
                        
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Booking Details</h3>
                            <p><strong>Booking Ref:</strong> ${data.bookingRef}</p>
                            <p><strong>Airline PNR:</strong> ${data.pnr}</p>
                            <p><strong>Booking Date:</strong> ${data.bookingDate}</p>
                        </div>
                        
                        <h3>Passengers</h3>
                        <ul>
                            ${data.passengers?.map(p => `<li>${p.title} ${p.firstName} ${p.lastName}</li>`).join('') || ''}
                        </ul>
                        
                        <h3>Flight Details</h3>
                        ${data.segments?.map(seg => `
                            <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px;">
                                <strong>${seg.airlineCode} ${seg.flightNumber}</strong><br>
                                ${seg.origin} → ${seg.destination}<br>
                                ${seg.departureDateTime}
                            </div>
                        `).join('') || ''}
                        
                        <h3>Fare Summary</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td>Base Fare</td><td style="text-align: right;">₹${data.fareSummary?.baseFare?.toLocaleString() || 0}</td></tr>
                            <tr><td>Taxes</td><td style="text-align: right;">₹${data.fareSummary?.taxes?.toLocaleString() || 0}</td></tr>
                            <tr><td>Service Fee</td><td style="text-align: right;">₹${data.fareSummary?.serviceFee?.toLocaleString() || 0}</td></tr>
                            <tr style="font-weight: bold; border-top: 2px solid #333;">
                                <td>Net Amount</td>
                                <td style="text-align: right;">₹${data.fareSummary?.netAmount?.toLocaleString() || 0}</td>
                            </tr>
                        </table>
                        
                        <p style="margin-top: 30px;">Please find the e-ticket attached to this email.</p>
                        
                        <p>Thank you for booking with Flyshop!</p>
                    </div>
                    <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                        <p>Flyshop.in | support@flyshop.in | 9218501850</p>
                    </div>
                </body>
                </html>
            `,
            
            welcome_agent: `
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; padding: 30px; text-align: center;">
                        <h1>Welcome to Flyshop! 🎉</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Dear ${data.agentName},</p>
                        <p>Congratulations! Your agent account has been approved and is now active.</p>
                        
                        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1a73e8;">Your Login Credentials</h3>
                            <p><strong>Agent Code:</strong> ${data.agentCode}</p>
                            <p><strong>Email:</strong> ${data.email}</p>
                            <p><strong>Password:</strong> ${data.password}</p>
                            <p style="color: #d32f2f; font-size: 12px;">⚠️ Please change your password after first login</p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${data.loginUrl}" style="background: #1a73e8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Login to Your Account
                            </a>
                        </div>
                        
                        <h3>What you can do:</h3>
                        <ul>
                            <li>Search and book domestic & international flights</li>
                            <li>Manage your bookings</li>
                            <li>Track your wallet balance</li>
                            <li>Download invoices and tickets</li>
                        </ul>
                        
                        <p>If you have any questions, feel free to reach out to our support team:</p>
                        <p>📧 ${data.supportEmail}<br>📞 ${data.supportPhone}</p>
                        
                        <p>Happy booking!</p>
                        <p><strong>Team Flyshop</strong></p>
                    </div>
                </body>
                </html>
            `,
            
            password_reset: `
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #ff9800; color: white; padding: 20px; text-align: center;">
                        <h1>Password Reset</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Dear ${data.agentName},</p>
                        <p>Your password has been reset as requested.</p>
                        
                        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Your New Password</h3>
                            <p style="font-size: 18px; font-family: monospace; background: #fff; padding: 10px; border-radius: 4px;">
                                ${data.newPassword}
                            </p>
                        </div>
                        
                        <p style="color: #d32f2f;">⚠️ Please change this password immediately after logging in.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${data.loginUrl}" style="background: #ff9800; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Login Now
                            </a>
                        </div>
                        
                        <p>If you did not request this password reset, please contact support immediately.</p>
                    </div>
                </body>
                </html>
            `
        };
        
        return templates[templateName] || '<p>Template not found</p>';
    }
}

module.exports = new NotificationService();
