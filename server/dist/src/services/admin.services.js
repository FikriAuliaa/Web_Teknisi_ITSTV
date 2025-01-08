"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_models_1 = __importDefault(require("../models/admin.models"));
class ItemServices {
    async ShowAll() {
        return await admin_models_1.default.find();
    }
    async ShowOne(id) {
        return await admin_models_1.default.findById(id);
    }
    async AddItem(itemData) {
        const item = new admin_models_1.default(itemData);
        return await item.save();
    }
    async UpdateItem(id, itemData) {
        try {
            const updatedItem = await admin_models_1.default.findByIdAndUpdate(id, itemData, { new: true });
            if (!updatedItem) {
                throw new Error(`Item with ID ${id} not found`);
            }
            return updatedItem;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Failed to update item");
        }
    }
    async DeleteItem(id) {
        try {
            const deletedItem = await admin_models_1.default.findByIdAndDelete(id);
            if (!deletedItem) {
                throw new Error(`Item with ID ${id} not found`);
            }
            return deletedItem;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Failed to delete item");
        }
    }
}
exports.default = new ItemServices();
//# sourceMappingURL=admin.services.js.map