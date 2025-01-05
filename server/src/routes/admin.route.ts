import express from "express";
import ItemController from "../controllers/admin.controller";
const router = express.Router();

router.get("/", ItemController.ShowAll);
router.post("/", ItemController.AddItem);
router.get("/:id", ItemController.ShowOne);
router.patch("/:id", ItemController.UpdateItem);
router.delete("/:id", ItemController.DeleteItem);

export default router;