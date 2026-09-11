export function getCartController(req, res) {
    res.json({ message: "Dummy get cart" });
}
export function addItemToCartController(req, res) {
    res.json({ message: "Dummy add item to cart" });
}
export function updateCartItemController(req, res) {
    res.json({ message: `Dummy update cart item ${req.params.productId}` });
}
export function removeCartItemController(req, res) {
    res.json({ message: `Dummy remove cart item ${req.params.productId}` });
}
export function clearCartController(req, res) {
    res.json({ message: "Dummy clear cart" });
}
//# sourceMappingURL=cart.js.map