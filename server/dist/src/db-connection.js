"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const DATABASE_URI = process.env.DATABASE_URI;
if (!DATABASE_URI) {
    throw new Error('Please define the DATABASE_URI environment variable');
}
async function connectDB() {
    try {
        await mongoose_1.default.connect(DATABASE_URI, { connectTimeoutMS: 60000 });
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
exports.default = connectDB;
//# sourceMappingURL=db-connection.js.map