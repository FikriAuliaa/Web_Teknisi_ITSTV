import { Request, Response } from "express";
declare class ItemController {
    ShowAll(req: Request, res: Response): Promise<void>;
    ShowOne(req: Request, res: Response): Promise<void>;
    AddItem(req: Request, res: Response): Promise<void>;
    UpdateItem(req: Request, res: Response): Promise<void>;
    DeleteItem(req: Request, res: Response): Promise<void>;
}
declare const _default: ItemController;
export default _default;
