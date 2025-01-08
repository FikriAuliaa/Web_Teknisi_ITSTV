"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OperatorSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    NoTelp: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
});
exports.Operator = mongoose_1.default.model("Operators", OperatorSchema);
exports.default = exports.Operator;
//# sourceMappingURL=operator.models.js.map