import express = require("express");
import { Request, Response, NextFunction } from "express";
import userRoute from "./routes/userRoute";
import cors from "cors";
import { GlobalExceptionMiddleware } from "./middlewares/globalExceptionMiddleware";

const app = express();

// build multiple CRUD interfaces:
// Middleware để phân tích body của yêu cầu
app.use(express.json());
app.use(cors());

// Routes cho sản phẩm
app.use("/api", userRoute);

// Middleware xử lý lỗi 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

// Middleware xử lý lỗi chung
app.use(GlobalExceptionMiddleware);

export default app;
