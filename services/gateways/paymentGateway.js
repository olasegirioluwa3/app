class PaymentGateway {
    initiatePayment(amount, currency, data, callbackUrl) {
        throw new Error("Method not implemented.");
    }

    verifyPayment(paymentReference) {
        throw new Error("Method not implemented.");
    }

    createPlan(name, interval, amount) {
        throw new Error("Method not implemented.");
    }

    updateSubscriptionAmount(subscriptionId, newAmount) {
        throw new Error("Method not implemented.");
    }
}

export default PaymentGateway;
