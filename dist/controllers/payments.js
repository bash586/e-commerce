export function getPaymentByIdController(req, res) {
    res.json({ message: `Dummy get payment ${req.params.paymentId}` });
}
export function paymentWebhookController(req, res) {
    res.json({ message: "Dummy payment webhook" });
}
//# sourceMappingURL=payments.js.map