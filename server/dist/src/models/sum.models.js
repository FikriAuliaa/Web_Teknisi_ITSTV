"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BorrowSchema = new mongoose_1.default.Schema({
    item_name: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    borrow_date: {
        type: Date,
        default: new Date()
    },
    return_date: {
        type: Date,
        required: true
    },
    borrower_name: {
        type: String,
        required: true
    },
    officer_name: {
        type: String,
        required: true
    },
    is_returned: {
        type: Boolean,
        default: null
    }
});
const Borrowed = mongoose_1.default.model("Borrowed", BorrowSchema);
exports.default = Borrowed;
//# sourceMappingURL=sum.models.js.map