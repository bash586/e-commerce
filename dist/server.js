"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const config_js_1 = require("./config.js");
const PORT = config_js_1.config.port;
app_js_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map