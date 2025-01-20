import Borrowed from "../models/sum.models";
import Items from "../models/admin.models";

class BorrowServices {
  async ShowAll() {
    return await Borrowed.find();
  }

  async ShowOne(borrowId: string) {
    return await Borrowed.findById(borrowId);
  }

  async BorrowItem(
    borrowData: { borrowedItems: Array<{ item_id: string; amount: string }> },
    generalData: any
  ) {
    const { borrowedItems } = borrowData;

    if (!borrowedItems || borrowedItems.length === 0) {
      throw new Error("No items provided for borrowing.");
    }

    const now = new Date();
    const returnDate = new Date(generalData.return_date);

    if (returnDate <= now) {
      throw new Error("Return date must be in the future.");
    }

    const itemsToSave = [];

    for (const itemData of borrowedItems) {
      const { item_id, amount } = itemData;

      // Find item in the Items collection
      const item = await Items.findById(item_id);

      if (!item) {
        throw new Error(`Item with ID ${item_id} not found.`);
      }

      const requestedAmount = parseInt(amount, 10);
      const currentStock = parseInt(item.amount || "0", 10);

      if (requestedAmount <= 0 || currentStock < requestedAmount) {
        throw new Error(
          `Insufficient stock for item ${item.name}. Available: ${currentStock}, Requested: ${requestedAmount}.`
        );
      }

      // Update stock
      item.amount = (currentStock - requestedAmount).toString();
      await item.save();

      // Add to itemsToSave
      itemsToSave.push({
        item_id,
        item_name: item.name,
        amount: requestedAmount.toString(),
      });
    }

    // Create borrow record
    const borrowed = new Borrowed({
      ...generalData,
      items: itemsToSave, // Save items array
      is_returned: false,
    });

    return await borrowed.save();
  }

  async ReturnItem(borrowId: string) {
    // Find the borrowed transaction
    const borrowed = await Borrowed.findById(borrowId);

    if (!borrowed) {
      throw new Error("Borrowed transaction not found :(");
    }

    // Check if already returned
    if (borrowed.is_returned === true) {
      throw new Error("All items in this transaction are already returned :(");
    }

    // Iterate over all items in the transaction
    for (const borrowedItem of borrowed.items) {
      const { item_id, amount } = borrowedItem;

      // Find the item in Items collection
      const item = await Items.findById(item_id);

      if (!item) {
        throw new Error(`Item with ID ${item_id} not found.`);
      }

      // Update stock
      const returnAmount = parseInt(amount, 10);
      const currentStock = parseInt(item.amount || "0", 10);

      item.amount = (currentStock + returnAmount).toString();
      await item.save();
    }

    // Mark transaction as returned
    borrowed.is_returned = true;
    borrowed.return_date = new Date();
    return await borrowed.save();
  }
}

export default BorrowServices;
