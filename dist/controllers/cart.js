"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartController = getCartController;
exports.addItemToCartController = addItemToCartController;
exports.updateCartItemController = updateCartItemController;
exports.removeCartItemController = removeCartItemController;
exports.clearCartController = clearCartController;
function getCartController(req, res) {
    res.json({ message: "Dummy get cart" });
}
function addItemToCartController(req, res) {
    res.json({ message: "Dummy add item to cart" });
}
function updateCartItemController(req, res) {
    res.json({ message: `Dummy update cart item ${req.params.productId}` });
}
function removeCartItemController(req, res) {
    res.json({ message: `Dummy remove cart item ${req.params.productId}` });
}
function clearCartController(req, res) {
    res.json({ message: "Dummy clear cart" });
}
//# sourceMappingURL=cart.js.map