import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  email: string; // Tambahkan email di interface
  password: string;
  role: "admin" | "operator";
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // Tambahkan email di schema
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "operator"],
      required: true,
      default: "operator",
    },
  },
  { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);
