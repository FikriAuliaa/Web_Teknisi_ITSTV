import { ItemInter } from "../models/admin.models";
declare class ItemServices {
    ShowAll(): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    }> & {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    ShowOne(id: string): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    }> & {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    AddItem(itemData: Partial<ItemInter>): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    }> & {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    UpdateItem(id: string, itemData: Partial<ItemInter>): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    }> & {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    DeleteItem(id: string): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    }> & {
        name: string;
        amount: string;
        condition: string;
        created_at: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
declare const _default: ItemServices;
export default _default;
