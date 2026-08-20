"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.logoutController = logoutController;
exports.refreshTokenController = refreshTokenController;
exports.getCurrentUserController = getCurrentUserController;
const z = __importStar(require("zod"));
const UserSchema = z.object({
    name: z.string().min(8),
    email: z.string().email()
});
async function registerController(req, res) {
    const data = req.body;
    res.json({ message: data.name });
}
async function loginController(req, res) {
    res.json({ message: "Dummy login" });
}
async function logoutController(req, res) {
    res.json({ message: "Dummy logout" });
}
async function refreshTokenController(req, res) {
    res.json({ message: "Dummy refresh token" });
}
async function getCurrentUserController(req, res) {
    res.json({ message: "Dummy get current user" });
}
//# sourceMappingURL=auth.js.map