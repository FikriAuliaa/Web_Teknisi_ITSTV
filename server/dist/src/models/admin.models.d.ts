import mongoose from "mongoose";
export interface ItemInter {
    name: string;
    amount: string;
    condition: string;
    created_at: Date;
}
declare const Items: mongoose.Model<{
    name: string;
    amount: string;
    condition: string;
    created_at: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
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
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    amount: string;
    condition: string;
    created_at: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    amount: string;
    condition: string;
    created_at: NativeDate;
}>> & mongoose.FlatRecord<{
    name: string;
    amount: string;
    condition: string;
    created_at: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Items;
