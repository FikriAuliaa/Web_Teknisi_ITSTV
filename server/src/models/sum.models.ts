import mongoose from "mongoose";

export interface BorrowInter {
  item_name: string;
  amount: string;
  borrow_date: Date;
  return_date: Date; // Required field
  borrower_name: string;
  officer_name: string;
  is_returned: boolean | null; // Add this field
  kategori: string; // Add kategori field
}

const BorrowSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  borrow_date: {
    type: Date,
    default: new Date(),
  },
  return_date: {
    type: Date,
    required: true, // This field is required
  },
  borrower_name: {
    type: String,
    required: true,
  },
  officer_name: {
    type: String,
    required: true,
  },
  is_returned: {
    type: Boolean,
    default: null,
  },
  kategori: {
    type: String,
    default: "Lain-lain", // Set default value
    required: true, // Ensure it is always provided
  },
});

const Borrowed = mongoose.model("Borrowed", BorrowSchema);

export default Borrowed;
