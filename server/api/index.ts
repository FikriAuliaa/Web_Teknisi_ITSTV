import express, { Request, Response, NextFunction } from "express";
import connectDB from "../src/db-connection";
import cors, { CorsOptions } from "cors";
import adminRouter from "../src/routes/admin.route";
import operatorRouter from "../src/routes/operator.route";
import authRouter from "../src/routes/authRoute";
import borrowRouter from "../src/routes/sum.route";

const app = express();
const PORT = 4000;

// Allowed Origins
const allowedOrigins: string[] = [
  "https://eureka-tv.netlify.app/", // Frontend di Netlify
  "http://localhost:5173", // Frontend lokal untuk pengembangan
];

// CORS Configuration
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Metode HTTP yang diizinkan
  allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
  credentials: true, // Mengizinkan cookie atau sesi
};

// Gunakan middleware CORS
app.use(cors(corsOptions));

// Tangani preflight request secara global
app.options("*", cors(corsOptions));

// Middleware untuk parsing JSON
app.use(express.json());

// Logging middleware untuk debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  next();
});

// Database Connection
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

// Middleware untuk preflight request
const handlePreflight: express.RequestHandler = (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.status(204).end(); // Mengakhiri respons
  } else {
    next();
  }
};

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hi Ges");
});

app.use("/admin", adminRouter);
app.use("/operator", operatorRouter);
app.use("/auth", handlePreflight, authRouter);
app.use("/borrow", borrowRouter);

// Error Handling Middleware
app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction // Middleware error dengan tipe
  ) => {
    console.error("Unhandled Error:", err.message);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  }
);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
