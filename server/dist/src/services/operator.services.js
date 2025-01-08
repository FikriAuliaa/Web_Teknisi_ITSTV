"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_models_1 = require("../models/operator.models");
class OperatorServices {
    async ShowAll() {
        return await operator_models_1.Operator.find();
    }
    async AddOperator(operatorData) {
        const operator = new operator_models_1.Operator(operatorData);
        return await operator.save();
    }
    async UpdateOperator(id, operatorData) {
        try {
            const updatedOperator = await operator_models_1.Operator.findByIdAndUpdate(id, operatorData, { new: true });
            if (!updatedOperator) {
                throw new Error(`Operator with ID ${id} not found`);
            }
            return updatedOperator;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Failed to update operator");
        }
    }
    async DeleteOperator(id) {
        try {
            const deletedOperator = await operator_models_1.Operator.findByIdAndDelete(id);
            if (!deletedOperator) {
                throw new Error(`Operator with ID ${id} not found`);
            }
            return deletedOperator;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Failed to delete operator");
        }
    }
}
exports.default = new OperatorServices();
//# sourceMappingURL=operator.services.js.map