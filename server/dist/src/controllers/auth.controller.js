"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_services_1 = require("../services/auth.services");
const token_services_1 = require("../services/token.services");
const authService = new auth_services_1.AuthService();
const register = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await authService.register(username, email, password, role);
        return res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error during registration:", error.message);
            return res.status(400).json({ message: error.message });
        }
        else {
            console.error("Unknown error during registration:", error);
            return res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const { user, token } = await authService.login(username, password);
        const tokenWithExpiry = (0, token_services_1.createToken)({
            id: String(user._id),
            username: user.username,
            role: user.role
        });
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token: tokenWithExpiry,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error during login:", error.message);
            return res.status(401).json({ message: error.message });
        }
        else {
            console.error("Unknown error during login:", error);
            return res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map