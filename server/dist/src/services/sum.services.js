"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sum_models_1 = __importDefault(require("../models/sum.models"));
const admin_models_1 = __importDefault(require("../models/admin.models"));
class BorrowServices {
    async ShowAll() {
        return await sum_models_1.default.find();
    }
    async ShowOne(borrowId) {
        return await sum_models_1.default.findById(borrowId);
    }
    async BorrowItem(borrowData, itemId) {
        const item = await admin_models_1.default.findById(itemId);
        if (!item) {
            throw new Error("Item not found :(");
        }
        if (borrowData.item_name && borrowData.item_name !== item.name) {
            throw new Error("Item name does not match the database entry :(");
        }
        if (!borrowData.return_date) {
            throw new Error("Return date is required :(");
        }
        const returnDate = new Date(borrowData.return_date);
        const now = new Date();
        if (returnDate <= now) {
            throw new Error("Return date must be in the future :(");
        }
        const borrowAmount = parseInt(borrowData.amount || "0", 10);
        const currentStock = parseInt(item.amount || "0", 10);
        if (isNaN(borrowAmount) || borrowAmount <= 0) {
            throw new Error("Invalid borrow amount :(");
        }
        if (isNaN(currentStock)) {
            throw new Error("Invalid item stock :(");
        }
        if (currentStock < borrowAmount) {
            throw new Error(`Not enough stock available :( (Available: ${currentStock}, Requested: ${borrowAmount})`);
        }
        const newStock = currentStock - borrowAmount;
        try {
            await admin_models_1.default.findByIdAndUpdate(itemId, { amount: newStock.toString() });
            const borrowed = new sum_models_1.default({
                ...borrowData,
                return_date: returnDate,
            });
            return await borrowed.save();
        }
        catch (error) {
            await admin_models_1.default.findByIdAndUpdate(itemId, {
                amount: currentStock.toString(),
            });
            throw new Error("Failed to process borrow transaction :(");
        }
    }
    async ReturnItem(borrowId) {
        const borrowed = await sum_models_1.default.findById(borrowId);
        if (!borrowed) {
            throw new Error("Borrowed item not found :(");
        }
        const item = await admin_models_1.default.findOne({ name: borrowed.item_name });
        if (!item) {
            throw new Error("Item not found :(");
        }
        if (borrowed.is_returned === true) {
            throw new Error("Item already returned :(");
        }
        const borrowAmount = parseInt(borrowed.amount || "0", 10);
        const stock = parseInt(item.amount || "0", 10);
        try {
            item.amount = (stock + borrowAmount).toString();
            await item.save();
            borrowed.is_returned = true;
            borrowed.return_date = new Date();
            return await borrowed.save();
        }
        catch (error) {
            if (item) {
                item.amount = stock.toString();
                await item.save();
            }
            throw new Error("Failed to process return transaction :(");
        }
    }
}
exports.default = BorrowServices;
//# sourceMappingURL=sum.services.js.map