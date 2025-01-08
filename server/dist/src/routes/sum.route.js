"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sum_controller_1 = __importDefault(require("../controllers/sum.controller"));
const router = express_1.default.Router();
router.post("/:id", sum_controller_1.default.BorrowItem);
router.get("/", sum_controller_1.default.ShowAll);
router.get("/:id", sum_controller_1.default.ShowOne);
router.post("/return/:id", sum_controller_1.default.ReturnItem);
exports.default = router;
//# sourceMappingURL=sum.route.js.map