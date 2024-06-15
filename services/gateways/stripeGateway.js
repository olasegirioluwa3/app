import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import axios from 'axios';
import PaymentGateway from './paymentGateway.js'; // Assuming the abstract gateway is in the same directory

class StripeGateway extends PaymentGateway {
    constructor() {
        super();
        this.paystackUrl = 'https://api.paystack.co';
        this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    }

    async initiatePayment(amount, currency, data, callbackUrl) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Stripe expects the amount in cents
                currency: currency,
                payment_method_types: ['card'],
                description: data.description || 'Payment',
                metadata: { integration_check: 'accept_a_payment' },
                confirm: true,
                return_url: callbackUrl
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        } catch (error) {
            console.error('Stripe initiation error:', error);
            throw new Error('Failed to initiate payment with Stripe');
        }
    }

    async verifyPayment(paymentReference) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentReference);

            if (paymentIntent.status === 'succeeded') {
                return {
                    status: 'success',
                    amount: paymentIntent.amount / 100, // convert cents to main currency unit
                    currency: paymentIntent.currency,
                    paymentMethod: paymentIntent.payment_method
                };
            } else {
                return {
                    status: 'failed'
                };
            }
        } catch (error) {
            console.error('Stripe verification error:', error);
            throw new Error('Failed to verify payment with Stripe');
        }
    }
}

export default StripeGateway;