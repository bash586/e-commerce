export function getOrdersController(req, res) {
    res.json({ message: "Dummy get orders" });
}
export function getOrderByIdController(req, res) {
    res.json({ message: `Dummy get order ${req.params.orderId}` });
}
//# sourceMappingURL=orders.js.map