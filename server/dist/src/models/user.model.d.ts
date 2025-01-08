import mongoose, { Document } from "mongoose";
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    role: "admin" | "operator";
}
declare const _default: mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
