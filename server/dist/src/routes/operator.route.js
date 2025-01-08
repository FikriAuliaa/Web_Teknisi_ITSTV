"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const operator_controller_1 = __importDefault(require("../controllers/operator.controller"));
const router = express_1.default.Router();
router.get("/", operator_controller_1.default.ShowAll);
router.post("/", operator_controller_1.default.AddOperator);
router.patch("/:id", operator_controller_1.default.UpdateOperator);
router.delete("/:id", operator_controller_1.default.DeleteOperator);
exports.default = router;
//# sourceMappingURL=operator.route.js.map