"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).json({
            status: "error",
            message: "Token not found",
            data: {},
        });
        return;
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({
                status: "error",
                message: "Failed to authenticate token",
                data: {},
            });
            return;
        }
        const { id, username, role } = decoded;
        req.body.user = {
            id,
            username,
            role,
        };
        next();
    });
};
exports.authenticateToken = authenticateToken;
const authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.body.user?.role;
        if (!roles.includes(userRole)) {
            res.status(403).json({
                status: "error",
                message: "You do not have permission to access this resource",
                data: {},
            });
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=authMiddleware.js.map