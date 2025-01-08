import mongoose from "mongoose";
export interface BorrowInter {
    item_name: string;
    amount: string;
    borrow_date: Date;
    return_date: Date;
    borrower_name: string;
    officer_name: string;
    is_returned: boolean | null;
}
declare const Borrowed: mongoose.Model<{
    amount: string;
    item_name: string;
    borrow_date: NativeDate;
    return_date: NativeDate;
    borrower_name: string;
    officer_name: string;
    is_returned: boolean;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    amount: string;
    item_name: string;
    borrow_date: NativeDate;
    return_date: NativeDate;
    borrower_name: string;
    officer_name: string;
    is_returned: boolean;
}> & {
    amount: string;
    item_name: string;
    borrow_date: NativeDate;
    return_date: NativeDate;
    borrower_name: string;
    officer_name: string;
    is_returned: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    amount: string;
    item_name: string;
    borrow_date: NativeDate;
    return_date: NativeDate;
    borrower_name: string;
    officer_name: string;
    is_returned: boolean;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    amount: string;
    item_name: string;
    borrow_date: NativeDate;
    return_date: NativeDate;
    borrower_name: string;
    officer_name: string;
    is_returned: boolean;
}>> & mongoose.FlatRecord<{
    amount: string;
    item_name: string;
    borrow_date: NativeDate;
    return_date: NativeDate;
    borrower_name: string;
    officer_name: string;
    is_returned: boolean;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Borrowed;
