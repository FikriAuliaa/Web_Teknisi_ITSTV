"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_services_1 = __importDefault(require("../services/admin.services"));
class ItemController {
    async ShowAll(req, res) {
        try {
            const items = await admin_services_1.default.ShowAll();
            res.status(200).json({
                data: items,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: [],
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while fetching items",
                    data: [],
                });
            }
        }
    }
    async ShowOne(req, res) {
        try {
            const id = req.params.id;
            const item = await admin_services_1.default.ShowOne(id);
            res.status(200).json({
                data: item,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: {},
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while fetching item",
                    data: {},
                });
            }
        }
    }
    async AddItem(req, res) {
        try {
            const itemData = req.body;
            const item = await admin_services_1.default.AddItem(itemData);
            res.status(200).json({
                status: "success",
                message: "Item added successfully",
                data: item,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: {},
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while adding item",
                    data: {},
                });
            }
        }
    }
    async UpdateItem(req, res) {
        try {
            const id = req.params.id;
            const itemData = req.body;
            const updatedItem = await admin_services_1.default.UpdateItem(id, itemData);
            res.status(200).json({
                status: "success",
                message: "Item updated successfully",
                data: updatedItem,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: {},
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while updating item",
                    data: {},
                });
            }
        }
    }
    async DeleteItem(req, res) {
        try {
            const id = req.params.id;
            const deletedItem = await admin_services_1.default.DeleteItem(id);
            res.status(200).json({
                status: "success",
                message: "Item deleted successfully",
                data: deletedItem,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: {},
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while deleting item",
                    data: {},
                });
            }
        }
    }
}
exports.default = new ItemController();
//# sourceMappingURL=admin.controller.js.map