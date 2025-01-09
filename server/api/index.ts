import express from "express";
import connectDB from "../src/db-connection";
import cors, { CorsOptions } from "cors";
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
const allowedOrigins: string[] = [
  "https://peminjaman-gemilang.netlify.app",
  "http://localhost:5173", // Tambahkan localhost untuk pengembangan
];

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Metode yang diizinkan
  allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
  credentials: true, // Jika menggunakan cookies atau sesi
};

// Gunakan middleware CORS
app.use(cors(corsOptions));

// Tangani preflight request (OPTIONS)
app.options("*", cors(corsOptions));

// Middleware untuk parsing JSON
app.use(express.json());

// Debugging middleware untuk melihat request origin
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

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
