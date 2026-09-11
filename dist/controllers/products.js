export async function getProductsController(req, res) {
    await getProducts();
    res.json({ message: "Dummy get products" });
}
export function addProductByIdController(req, res) {
    res.json({ message: "Dummy get products" });
}
export function getProductByIdController(req, res) {
    res.json({ message: `Dummy get product ${req.params.productId}` });
}
//# sourceMappingURL=products.js.map