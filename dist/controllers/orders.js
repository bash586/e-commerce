"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersController = getOrdersController;
exports.getOrderByIdController = getOrderByIdController;
function getOrdersController(req, res) {
    res.json({ message: "Dummy get orders" });
}
function getOrderByIdController(req, res) {
    res.json({ message: `Dummy get order ${req.params.orderId}` });
}
//# sourceMappingURL=orders.js.map