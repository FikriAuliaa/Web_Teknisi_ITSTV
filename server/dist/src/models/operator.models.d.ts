import mongoose from "mongoose";
export interface OperatorInter {
    name: string;
    NoTelp: string;
    Email: string;
}
export interface BookingInter {
    item_name: string;
    amount: string;
    borrow_date: Date;
    return_date: Date;
    borrower_name: string;
    officer_name: string;
}
export declare const Operator: mongoose.Model<{
    name: string;
    NoTelp: string;
    Email: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    NoTelp: string;
    Email: string;
}> & {
    name: string;
    NoTelp: string;
    Email: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    NoTelp: string;
    Email: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    NoTelp: string;
    Email: string;
}>> & mongoose.FlatRecord<{
    name: string;
    NoTelp: string;
    Email: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Operator;
