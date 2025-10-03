import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import signatureRoutes from "./routes/signatureRoutes";
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// API routes
app.use("/api", signatureRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `🔐 Signature verification: http://localhost:${PORT}/api/verify-signature`
  );
});

export default app;
