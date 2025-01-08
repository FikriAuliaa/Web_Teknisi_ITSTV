import express from "express";
import connectDB from "../src/db-connection";
import cors from "cors";
import adminRouter from "../src/routes/admin.route";
import operatorRouter from "../src/routes/operator.route";
import authRouter from "../src/routes/authRoute";
import borrowRouter from "../src/routes/sum.route";
import {
  authenticateToken,
  authorizeRole,
} from "../src/middleware/authMiddleware";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
connectDB();

app.get("/", (req, res) => {
  res.send("Hi Ges");
});

// Modified routes to allow both roles to access
app.use("/admin", authenticateToken, adminRouter);
app.use("/operator", authenticateToken, operatorRouter);
app.use("/auth", authRouter);
app.use("/borrow", borrowRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
