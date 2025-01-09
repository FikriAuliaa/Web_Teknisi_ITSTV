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

// CORS Configuration
const allowedOrigins = [
  "https://peminjaman-gemilang.netlify.app/",
  "http://localhost:5173",
];
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hi Ges");
});

app.use("/admin", authenticateToken, adminRouter);
app.use("/operator", authenticateToken, operatorRouter);
app.use("/auth", authRouter);
app.use("/borrow", borrowRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
