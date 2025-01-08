"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowController = void 0;
const sum_services_1 = __importDefault(require("../services/sum.services"));
class BorrowController {
    async ShowAll(req, res) {
        try {
            const borrowServices = new sum_services_1.default();
            const borrowed = await borrowServices.ShowAll();
            res.status(200).json({
                data: borrowed,
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
                    message: "Internal server error while fetching borrowed items",
                    data: [],
                });
            }
        }
    }
    async ShowOne(req, res) {
        try {
            const borrowId = req.params.id;
            const borrowServices = new sum_services_1.default();
            const borrowed = await borrowServices.ShowOne(borrowId);
            res.status(200).json({
                data: borrowed,
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
                    message: "Internal server error while fetching borrowed item",
                    data: {},
                });
            }
        }
    }
    async BorrowItem(req, res) {
        try {
            const borrowData = req.body;
            const itemId = req.params.id;
            const borrowServices = new sum_services_1.default();
            const borrowed = await borrowServices.BorrowItem(borrowData, itemId);
            res.status(200).json({
                status: "success",
                message: "Item borrowed successfully",
                data: borrowed,
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
                    message: "Internal server error while borrowing item",
                    data: {},
                });
            }
        }
    }
    async ReturnItem(req, res) {
        try {
            const borrowId = req.params.id;
            const borrowServices = new sum_services_1.default();
            const borrowed = await borrowServices.ReturnItem(borrowId);
            res.status(200).json({
                status: "success",
                message: "Item returned successfully",
                data: borrowed,
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
                    message: "Internal server error while returning item",
                    data: {},
                });
            }
        }
    }
}
exports.BorrowController = BorrowController;
exports.default = new BorrowController();
//# sourceMappingURL=sum.controller.js.map