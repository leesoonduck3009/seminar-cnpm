import express = require("express");
import { Request, Response, NextFunction } from "express";
import userRoute from "./routes/userRoute";
import cors from "cors";

var app = express();

// build multiple CRUD interfaces:
// Middleware để phân tích body của yêu cầu
app.use(express.json());
app.use(cors());

// Route chính
app.get("/", (req: Request, res: Response) => {
  console.log("Hello");
  res.json({ test: "Welcome to the Product API!" });
});

// Routes cho sản phẩm
app.use("/api", userRoute);

// Middleware xử lý lỗi 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

// Middleware xử lý lỗi chung
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
