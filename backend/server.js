const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const catalogRoutes = require("./src/routes/catalogRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const errorHandler = require("./src/middleware/errorHandler");
const database = require("./src/config/database");
const reviewRoutes = require("./src/routes/reviewRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://urbancart-ecommerce.vercel.app",
];

app.locals.db = database;

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS check, origin =", origin || "NO ORIGIN");

      // allow REST tools or direct server calls with no origin
      if (!origin) return callback(null, true);

      // allow any Vercel deployment of this project
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      // also allow explicit list (localhost, main prod URL)
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/reviews", reviewRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);

  // Test database connection
  database
    .query("SELECT NOW()")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing server...");
  await database.close();
  process.exit(0);
});
