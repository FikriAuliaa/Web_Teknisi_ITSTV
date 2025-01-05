import Items from "../models/admin.models";
import { ItemInter } from "../models/admin.models";

class ItemServices {
  async ShowAll() {
    return await Items.find();
  }

  async ShowOne(id: string) {
    return await Items.findById(id);
  }

  async AddItem(itemData: Partial<ItemInter>) {
    const item = new Items(itemData);
    return await item.save();
  }

  async UpdateItem(id: string, itemData: Partial<ItemInter>) {
    try {
      const updatedItem = await Items.findByIdAndUpdate
      (id, itemData, { new: true });
      if (!updatedItem) {
        throw new Error(`Item with ID ${id} not found`);
      }
      return updatedItem;

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update item");
    }
  }

  async DeleteItem(id: string) {
    try {
      const deletedItem = await Items.findByIdAndDelete(id);
      if (!deletedItem) {
        throw new Error(`Item with ID ${id} not found`);
      }
      return deletedItem;

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete item");
    }
  }
}



export default new ItemServices();