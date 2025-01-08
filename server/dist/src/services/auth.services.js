"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    }
    async register(username, email, password, role) {
        const existingUser = await user_model_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new Error('Username or email already exists');
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new user_model_1.default({ username, email, password: hashedPassword, role });
        await user.save();
        return user;
    }
    async login(username, password) {
        const user = await user_model_1.default.findOne({ username });
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username, role: user.role }, this.jwtSecret, { expiresIn: '1d' });
        return { user, token };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.services.js.map