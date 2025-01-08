import { Request, Response } from "express";
declare class OperatorController {
    ShowAll(req: Request, res: Response): Promise<void>;
    AddOperator(req: Request, res: Response): Promise<void>;
    UpdateOperator(req: Request, res: Response): Promise<void>;
    DeleteOperator(req: Request, res: Response): Promise<void>;
}
declare const _default: OperatorController;
export default _default;
