import express from "express";
import BorrowController from "../controllers/sum.controller";
const router = express.Router();

router.post("/:id", BorrowController.BorrowItem);
router.get("/", BorrowController.ShowAll);
router.get("/:id", BorrowController.ShowOne);
router.post("/return/:id", BorrowController.ReturnItem);

export default router;