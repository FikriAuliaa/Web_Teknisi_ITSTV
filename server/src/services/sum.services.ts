import Borrowed from "../models/sum.models";
import { BorrowInter } from "../models/sum.models";
import Items from "../models/admin.models";

class BorrowServices {
  async ShowAll() {
    return await Borrowed.find();
  }

  async ShowOne(borrowId: string) {
    return await Borrowed.findById(borrowId);
  }

  async BorrowItem(borrowData: Partial<BorrowInter>, itemId: string) {
    // Find the item in the Items collection
    const item = await Items.findById(itemId);

    if (!item) {
      throw new Error("Item not found :(");
    }

    // Ensure the item_name in borrowData matches the item name in the database
    if (borrowData.item_name && borrowData.item_name !== item.name) {
      throw new Error("Item name does not match the database entry :(");
    }

    // Validate return date
    if (!borrowData.return_date) {
      throw new Error("Return date is required :(");
    }

    const returnDate = new Date(borrowData.return_date);
    const now = new Date();

    if (returnDate <= now) {
      throw new Error("Return date must be in the future :(");
    }

    // Convert amounts to numbers and validate
    const borrowAmount = parseInt(borrowData.amount || "0", 10);
    const currentStock = parseInt(item.amount || "0", 10);

    // Validate amounts
    if (isNaN(borrowAmount) || borrowAmount <= 0) {
      throw new Error("Invalid borrow amount :(");
    }

    if (isNaN(currentStock)) {
      throw new Error("Invalid item stock :(");
    }

    // Check if enough stock is available
    if (currentStock < borrowAmount) {
      throw new Error(
        `Not enough stock available :( (Available: ${currentStock}, Requested: ${borrowAmount})`
      );
    }

    // Calculate new stock amount
    const newStock = currentStock - borrowAmount;

    try {
      // Update item stock in database
      await Items.findByIdAndUpdate(itemId, { amount: newStock.toString() });

      // Create and save borrow record
      const borrowed = new Borrowed({
        ...borrowData,
        return_date: returnDate,
      });

      return await borrowed.save();
    } catch (error) {
      // If saving fails, rollback the stock update
      await Items.findByIdAndUpdate(itemId, {
        amount: currentStock.toString(),
      });
      throw new Error("Failed to process borrow transaction :(");
    }
  }

  async ReturnItem(borrowId: string) {
    // Find the borrowed item
    const borrowed = await Borrowed.findById(borrowId);

    if (!borrowed) {
      throw new Error("Borrowed item not found :(");
    }

    // Find the item in Items collection
    const item = await Items.findOne({ name: borrowed.item_name });

    if (!item) {
      throw new Error("Item not found :(");
    }

    // Check if already returned
    if (borrowed.is_returned === true) {
      throw new Error("Item already returned :(");
    }

    // Convert amounts to numbers
    const borrowAmount = parseInt(borrowed.amount || "0", 10);
    const stock = parseInt(item.amount || "0", 10);

    try {
      // Update item stock
      item.amount = (stock + borrowAmount).toString();
      await item.save();

      // Update borrowed record
      borrowed.is_returned = true;
      borrowed.return_date = new Date(); // Keep this for record
      return await borrowed.save();
    } catch (error) {
      // Rollback if something fails
      if (item) {
        item.amount = stock.toString();
        await item.save();
      }
      throw new Error("Failed to process return transaction :(");
    }
  }
}

export default BorrowServices;
