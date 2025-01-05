import { Operator, OperatorInter } from "../models/operator.models";
import Items from "../models/admin.models";

class OperatorServices {
  async ShowAll() {
    return await Operator.find();
  }

  async AddOperator(operatorData: Partial<OperatorInter>) {
    const operator = new Operator(operatorData);
    return await operator.save();
  }

  async UpdateOperator(id: string, operatorData: Partial<OperatorInter>) {
    try {
      const updatedOperator = await Operator.findByIdAndUpdate
      (id, operatorData, { new: true });
      if (!updatedOperator) {
        throw new Error(`Operator with ID ${id} not found`);
      }
      return updatedOperator;

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update operator");
    }
  }

  async DeleteOperator(id: string) {
    try {
      const deletedOperator = await Operator.findByIdAndDelete(id);
      if (!deletedOperator) {
        throw new Error(`Operator with ID ${id} not found`);
      }
      return deletedOperator;

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete operator");
    }
  }

}

export default new OperatorServices();