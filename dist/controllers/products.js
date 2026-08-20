"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsController = getProductsController;
exports.getProductByIdController = getProductByIdController;
function getProductsController(req, res) {
    res.json({ message: "Dummy get products" });
}
function getProductByIdController(req, res) {
    res.json({ message: `Dummy get product ${req.params.productId}` });
}
//# sourceMappingURL=products.js.map