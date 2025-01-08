import { Request, Response } from "express";
export declare class BorrowController {
    ShowAll(req: Request, res: Response): Promise<void>;
    ShowOne(req: Request, res: Response): Promise<void>;
    BorrowItem(req: Request, res: Response): Promise<void>;
    ReturnItem(req: Request, res: Response): Promise<void>;
}
declare const _default: BorrowController;
export default _default;
