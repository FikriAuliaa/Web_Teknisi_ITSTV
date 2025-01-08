"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_connection_1 = __importDefault(require("../src/db-connection"));
const cors_1 = __importDefault(require("cors"));
const admin_route_1 = __importDefault(require("../src/routes/admin.route"));
const operator_route_1 = __importDefault(require("../src/routes/operator.route"));
const authRoute_1 = __importDefault(require("../src/routes/authRoute"));
const sum_route_1 = __importDefault(require("../src/routes/sum.route"));
const authMiddleware_1 = require("../src/middleware/authMiddleware");
const app = (0, express_1.default)();
const PORT = 4000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, db_connection_1.default)();
app.get("/", (req, res) => {
    res.send("Hi Ges");
});
app.use("/admin", authMiddleware_1.authenticateToken, admin_route_1.default);
app.use("/operator", authMiddleware_1.authenticateToken, operator_route_1.default);
app.use("/auth", authRoute_1.default);
app.use("/borrow", sum_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map