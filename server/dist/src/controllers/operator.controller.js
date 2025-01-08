"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const operator_services_1 = __importDefault(require("../services/operator.services"));
class OperatorController {
    async ShowAll(req, res) {
        try {
            const operators = await operator_services_1.default.ShowAll();
            res.status(200).json({
                data: operators
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: []
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while fetching operators",
                    data: []
                });
            }
        }
    }
    async AddOperator(req, res) {
        try {
            const operatorData = req.body;
            const operator = await operator_services_1.default.AddOperator(operatorData);
            res.status(200).json({
                status: "success",
                message: "Operator added successfully",
                data: operator
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: {}
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while adding operator",
                    data: {}
                });
            }
        }
    }
    async UpdateOperator(req, res) {
        try {
            const id = req.params.id;
            const operatorData = req.body;
            const updatedOperator = await operator_services_1.default.UpdateOperator(id, operatorData);
            res.status(200).json({
                status: "success",
                message: "Operator updated successfully",
                data: updatedOperator
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: {}
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while updating operator",
                    data: {}
                });
            }
        }
    }
    async DeleteOperator(req, res) {
        try {
            const id = req.params.id;
            const deletedOperator = await operator_services_1.default.DeleteOperator(id);
            res.status(200).json({
                status: "success",
                message: "Operator deleted successfully",
                data: deletedOperator
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    status: "failed",
                    message: error.message,
                    data: {}
                });
            }
            else {
                res.status(500).json({
                    status: "failed",
                    message: "Internal server error while deleting operator",
                    data: {}
                });
            }
        }
    }
}
exports.default = new OperatorController();
//# sourceMappingURL=operator.controller.js.map