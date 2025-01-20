import { Request, Response } from "express";
import BorrowServices from "../services/sum.services";

export class BorrowController {
  public async ShowAll(req: Request, res: Response) {
    try {
      const borrowServices = new BorrowServices();
      const borrowed = await borrowServices.ShowAll();
      res.status(200).json({
        data: borrowed,
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
          message: "Internal server error while fetching borrowed items",
          data: [],
        });
      }
    }
  }

  public async ShowOne(req: Request, res: Response) {
    try {
      const borrowId = req.params.id;
      const borrowServices = new BorrowServices();
      const borrowed = await borrowServices.ShowOne(borrowId);
      res.status(200).json({
        data: borrowed,
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
          message: "Internal server error while fetching borrowed item",
          data: {},
        });
      }
    }
  }

  public async BorrowItem(req: Request, res: Response) {
    try {
      const borrowData = req.body; // Expecting { borrowedItems: [{ item_id, amount }], other general data }
      console.log("Data Received:", borrowData); // Debugging log
      const borrowServices = new BorrowServices();
      const borrowed = await borrowServices.BorrowItem(borrowData, borrowData);
      res.status(200).json({
        status: "success",
        message: "Items borrowed successfully",
        data: borrowed,
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
          message: "Internal server error while borrowing items",
          data: [],
        });
      }
    }
  }

  public async ReturnItem(req: Request, res: Response) {
    try {
      const borrowId = req.params.id;
      const borrowServices = new BorrowServices();
      const borrowed = await borrowServices.ReturnItem(borrowId);
      res.status(200).json({
        status: "success",
        message: "Item returned successfully",
        data: borrowed,
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
          message: "Internal server error while returning item",
          data: {},
        });
      }
    }
  }
}

export default new BorrowController();
