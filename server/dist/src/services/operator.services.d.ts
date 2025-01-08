import { OperatorInter } from "../models/operator.models";
declare class OperatorServices {
    ShowAll(): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        NoTelp: string;
        Email: string;
    }> & {
        name: string;
        NoTelp: string;
        Email: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    AddOperator(operatorData: Partial<OperatorInter>): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        NoTelp: string;
        Email: string;
    }> & {
        name: string;
        NoTelp: string;
        Email: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    UpdateOperator(id: string, operatorData: Partial<OperatorInter>): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        NoTelp: string;
        Email: string;
    }> & {
        name: string;
        NoTelp: string;
        Email: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    DeleteOperator(id: string): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        NoTelp: string;
        Email: string;
    }> & {
        name: string;
        NoTelp: string;
        Email: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
declare const _default: OperatorServices;
export default _default;
