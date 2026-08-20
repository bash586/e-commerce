"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentByIdController = getPaymentByIdController;
exports.paymentWebhookController = paymentWebhookController;
function getPaymentByIdController(req, res) {
    res.json({ message: `Dummy get payment ${req.params.paymentId}` });
}
function paymentWebhookController(req, res) {
    res.json({ message: "Dummy payment webhook" });
}
//# sourceMappingURL=payments.js.map