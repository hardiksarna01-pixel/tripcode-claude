/**
 * Webhook Controller
 */

class WebhookController {
    async handlePaymentWebhook(req, res) {
        try {
            const { event, payload, signature } = req.body;

            console.log(`Received payment webhook: ${event}`);

            // Process webhook based on event type
            switch (event) {
                case 'payment.captured':
                    console.log('Payment captured:', payload.payment_id);
                    break;
                case 'payment.failed':
                    console.log('Payment failed:', payload.payment_id);
                    break;
                case 'refund.processed':
                    console.log('Refund processed:', payload.refund_id);
                    break;
            }

            res.json({ success: true, message: 'Webhook processed' });
        } catch (error) {
            console.error('Payment webhook error:', error);
            res.status(500).json({ success: false, message: 'Webhook processing failed' });
        }
    }

    async handleSupplierWebhook(req, res) {
        try {
            const { supplier, event, data } = req.body;

            console.log(`Received supplier webhook from ${supplier}: ${event}`);

            switch (event) {
                case 'booking.confirmed':
                    console.log('Booking confirmed:', data.booking_id);
                    break;
                case 'booking.cancelled':
                    console.log('Booking cancelled:', data.booking_id);
                    break;
                case 'schedule.changed':
                    console.log('Schedule changed:', data.booking_id);
                    break;
            }

            res.json({ success: true, message: 'Webhook processed' });
        } catch (error) {
            console.error('Supplier webhook error:', error);
            res.status(500).json({ success: false, message: 'Webhook processing failed' });
        }
    }

    async handleInsuranceWebhook(req, res) {
        try {
            const { event, policy_id, claim_id, status } = req.body;

            console.log(`Insurance webhook: ${event}`);

            res.json({ success: true, message: 'Webhook processed' });
        } catch (error) {
            console.error('Insurance webhook error:', error);
            res.status(500).json({ success: false, message: 'Webhook processing failed' });
        }
    }

    async handleSMSWebhook(req, res) {
        try {
            const { message_id, status, phone } = req.body;

            console.log(`SMS delivery status: ${message_id} - ${status}`);

            res.json({ success: true, message: 'Webhook processed' });
        } catch (error) {
            console.error('SMS webhook error:', error);
            res.status(500).json({ success: false, message: 'Webhook processing failed' });
        }
    }

    async handleEmailWebhook(req, res) {
        try {
            const { email_id, event, recipient } = req.body;

            console.log(`Email event: ${email_id} - ${event}`);

            res.json({ success: true, message: 'Webhook processed' });
        } catch (error) {
            console.error('Email webhook error:', error);
            res.status(500).json({ success: false, message: 'Webhook processing failed' });
        }
    }
}

module.exports = new WebhookController();
