"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const router = express_1.default.Router();
router.get("/", admin_controller_1.default.ShowAll);
router.post("/", admin_controller_1.default.AddItem);
router.get("/:id", admin_controller_1.default.ShowOne);
router.patch("/:id", admin_controller_1.default.UpdateItem);
router.delete("/:id", admin_controller_1.default.DeleteItem);
exports.default = router;
//# sourceMappingURL=admin.route.js.map