/**
 * Notification Service
 * Email, SMS, WhatsApp, Push notifications
 */

const config = require('../../config');

class NotificationService {
    constructor() {
        this.emailProvider = this.initEmailProvider();
        this.smsProvider = this.initSmsProvider();
        this.whatsappProvider = this.initWhatsappProvider();
    }

    initEmailProvider() {
        switch (config.email.provider) {
            case 'sendgrid':
                return new SendGridProvider(config.email);
            case 'ses':
                return new SESProvider(config.email);
            default:
                return new SMTPProvider(config.email);
        }
    }

    initSmsProvider() {
        switch (config.sms.provider) {
            case 'twilio':
                return new TwilioSmsProvider(config.sms.twilio);
            default:
                return new MSG91Provider(config.sms.msg91);
        }
    }

    initWhatsappProvider() {
        switch (config.whatsapp.provider) {
            case 'meta':
                return new MetaWhatsappProvider(config.whatsapp.meta);
            default:
                return new WatiProvider(config.whatsapp.wati);
        }
    }

    /**
     * Send email
     */
    async sendEmail(to, templateId, data) {
        const template = await this.getTemplate('email', templateId);
        const content = this.renderTemplate(template, data);

        return this.emailProvider.send({
            to,
            subject: content.subject,
            html: content.html,
            text: content.text
        });
    }

    /**
     * Send SMS
     */
    async sendSms(to, templateId, data) {
        const template = await this.getTemplate('sms', templateId);
        const content = this.renderTemplate(template, data);

        return this.smsProvider.send({
            to,
            message: content.text
        });
    }

    /**
     * Send WhatsApp message
     */
    async sendWhatsapp(to, templateId, data) {
        const template = await this.getTemplate('whatsapp', templateId);

        return this.whatsappProvider.send({
            to,
            templateName: template.name,
            parameters: this.mapTemplateParams(template, data)
        });
    }

    /**
     * Send booking confirmation
     */
    async sendBookingConfirmation(booking, user) {
        const data = this.prepareBookingData(booking);

        await Promise.all([
            this.sendEmail(user.email, 'booking_confirmation', data),
            this.sendSms(user.phone, 'booking_confirmation', data),
            this.sendWhatsapp(user.phone, 'booking_confirmation', data)
        ]);
    }

    /**
     * Send booking cancellation
     */
    async sendBookingCancellation(booking, user, refundAmount) {
        const data = {
            ...this.prepareBookingData(booking),
            refundAmount
        };

        await Promise.all([
            this.sendEmail(user.email, 'booking_cancellation', data),
            this.sendSms(user.phone, 'booking_cancellation', data)
        ]);
    }

    /**
     * Send payment confirmation
     */
    async sendPaymentConfirmation(payment, user) {
        const data = {
            transactionId: payment.transactionId,
            amount: payment.amount,
            date: new Date().toISOString(),
            paymentMethod: payment.method
        };

        await this.sendEmail(user.email, 'payment_confirmation', data);
    }

    /**
     * Send wallet top-up confirmation
     */
    async sendWalletTopupConfirmation(transaction, user) {
        const data = {
            amount: transaction.amount,
            newBalance: transaction.newBalance,
            transactionId: transaction.id
        };

        await Promise.all([
            this.sendEmail(user.email, 'wallet_topup', data),
            this.sendSms(user.phone, 'wallet_topup', data)
        ]);
    }

    /**
     * Send OTP
     */
    async sendOtp(to, otp, type = 'sms') {
        const data = { otp };

        if (type === 'email') {
            return this.sendEmail(to, 'otp', data);
        }
        return this.sendSms(to, 'otp', data);
    }

    /**
     * Send password reset
     */
    async sendPasswordReset(email, resetLink) {
        return this.sendEmail(email, 'password_reset', { resetLink });
    }

    /**
     * Send welcome email
     */
    async sendWelcomeEmail(user) {
        return this.sendEmail(user.email, 'welcome', {
            name: user.firstName,
            email: user.email
        });
    }

    /**
     * Send agent approval notification
     */
    async sendAgentApproval(agent) {
        const data = {
            name: agent.firstName,
            companyName: agent.companyName,
            email: agent.email
        };

        await Promise.all([
            this.sendEmail(agent.email, 'agent_approved', data),
            this.sendSms(agent.phone, 'agent_approved', data)
        ]);
    }

    // Helper methods
    async getTemplate(type, templateId) {
        // In production, fetch from database
        const templates = {
            email: {
                booking_confirmation: {
                    subject: 'Booking Confirmation - {{bookingId}}',
                    html: '<h1>Booking Confirmed</h1><p>Your booking {{bookingId}} is confirmed.</p>'
                },
                otp: {
                    subject: 'Your OTP Code',
                    html: '<p>Your OTP is: <strong>{{otp}}</strong></p>'
                }
            },
            sms: {
                booking_confirmation: {
                    text: 'Your booking {{bookingId}} is confirmed. Thank you!'
                },
                otp: {
                    text: 'Your OTP is {{otp}}. Valid for 10 minutes.'
                }
            },
            whatsapp: {
                booking_confirmation: {
                    name: 'booking_confirmation',
                    params: ['bookingId', 'passengerName', 'travelDate']
                }
            }
        };

        return templates[type]?.[templateId] || null;
    }

    renderTemplate(template, data) {
        const render = (str) => {
            return str.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || '');
        };

        return {
            subject: template.subject ? render(template.subject) : null,
            html: template.html ? render(template.html) : null,
            text: template.text ? render(template.text) : null
        };
    }

    prepareBookingData(booking) {
        return {
            bookingId: booking.id,
            bookingRef: booking.referenceNumber,
            passengerName: booking.passengers?.[0]?.name,
            travelDate: booking.travelDate,
            productType: booking.productType,
            totalAmount: booking.totalAmount
        };
    }

    mapTemplateParams(template, data) {
        return template.params?.map(param => data[param]) || [];
    }
}

/**
 * SMTP Email Provider
 */
class SMTPProvider {
    constructor(config) {
        this.config = config;
        const nodemailer = require('nodemailer');
        this.transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.password
            }
        });
    }

    async send({ to, subject, html, text }) {
        return this.transporter.sendMail({
            from: `"${this.config.from.name}" <${this.config.from.email}>`,
            to,
            subject,
            html,
            text
        });
    }
}

/**
 * SendGrid Email Provider
 */
class SendGridProvider {
    constructor(config) {
        this.config = config;
    }

    async send({ to, subject, html, text }) {
        // Implement SendGrid API call
        console.log('SendGrid email sent to:', to);
    }
}

/**
 * SES Email Provider
 */
class SESProvider {
    constructor(config) {
        this.config = config;
    }

    async send({ to, subject, html, text }) {
        // Implement AWS SES API call
        console.log('SES email sent to:', to);
    }
}

/**
 * MSG91 SMS Provider
 */
class MSG91Provider {
    constructor(config) {
        this.config = config;
    }

    async send({ to, message }) {
        // Implement MSG91 API call
        console.log('MSG91 SMS sent to:', to);
    }
}

/**
 * Twilio SMS Provider
 */
class TwilioSmsProvider {
    constructor(config) {
        this.config = config;
        if (config.accountSid) {
            this.client = require('twilio')(config.accountSid, config.authToken);
        }
    }

    async send({ to, message }) {
        if (!this.client) return;

        return this.client.messages.create({
            body: message,
            from: this.config.phoneNumber,
            to
        });
    }
}

/**
 * WATI WhatsApp Provider
 */
class WatiProvider {
    constructor(config) {
        this.config = config;
    }

    async send({ to, templateName, parameters }) {
        // Implement WATI API call
        console.log('WATI WhatsApp sent to:', to);
    }
}

/**
 * Meta WhatsApp Provider
 */
class MetaWhatsappProvider {
    constructor(config) {
        this.config = config;
    }

    async send({ to, templateName, parameters }) {
        // Implement Meta WhatsApp Business API call
        console.log('Meta WhatsApp sent to:', to);
    }
}

module.exports = new NotificationService();
