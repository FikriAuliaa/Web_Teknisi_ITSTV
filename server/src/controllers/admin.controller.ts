import { Request, Response } from "express";
import ItemServices from "../services/admin.services";

class ItemController {
  public async ShowAll(req: Request, res: Response) {
    try {
      const items = await ItemServices.ShowAll();
      res.status(200).json({
        data: items,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: "failed",
          message: error.message,
          data: [],
        });
      } else {
        res.status(500).json({
          status: "failed",
          message: "Internal server error while fetching items",
          data: [],
        });
      }
    }
  }

  public async ShowOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const item = await ItemServices.ShowOne(id);
      res.status(200).json({
        data: item,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: "failed",
          message: error.message,
          data: {},
        });
      } else {
        res.status(500).json({
          status: "failed",
          message: "Internal server error while fetching item",
          data: {},
        });
      }
    }
  }

  public async AddItem(req: Request, res: Response) {
    try {
      const itemData = req.body;
      const item = await ItemServices.AddItem(itemData);
      res.status(200).json({
        status: "success",
        message: "Item added successfully",
        data: item,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: "failed",
          message: error.message,
          data: {},
        });
      } else {
        res.status(500).json({
          status: "failed",
          message: "Internal server error while adding item",
          data: {},
        });
      }
    }
  }

  public async UpdateItem(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const itemData = req.body;
      const updatedItem = await ItemServices.UpdateItem(id, itemData);
      res.status(200).json({
        status: "success",
        message: "Item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: "failed",
          message: error.message,
          data: {},
        });
      } else {
        res.status(500).json({
          status: "failed",
          message: "Internal server error while updating item",
          data: {},
        });
      }
    }
  }

  public async DeleteItem(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedItem = await ItemServices.DeleteItem(id);
      res.status(200).json({
        status: "success",
        message: "Item deleted successfully",
        data: deletedItem,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: "failed",
          message: error.message,
          data: {},
        });
      } else {
        res.status(500).json({
          status: "failed",
          message: "Internal server error while deleting item",
          data: {},
        });
      }
    }
  }
}

export default new ItemController();
