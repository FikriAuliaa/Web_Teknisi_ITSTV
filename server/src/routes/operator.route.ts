import express from "express";
import OperatorController from "../controllers/operator.controller";
const router = express.Router();

router.get("/", OperatorController.ShowAll);
router.post("/", OperatorController.AddOperator);
router.patch("/:id", OperatorController.UpdateOperator);
router.delete("/:id", OperatorController.DeleteOperator);


export default router;