import { BorrowInter } from "../models/sum.models";
declare class BorrowServices {
    ShowAll(): Promise<(import("mongoose").Document<unknown, {}, {
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    ShowOne(borrowId: string): Promise<import("mongoose").Document<unknown, {}, {
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    BorrowItem(borrowData: Partial<BorrowInter>, itemId: string): Promise<import("mongoose").Document<unknown, {}, {
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    ReturnItem(borrowId: string): Promise<import("mongoose").Document<unknown, {}, {
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
export default BorrowServices;
