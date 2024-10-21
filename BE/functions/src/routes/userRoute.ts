import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();
router.get("/", userController.GetAllUser);
router.post("/", userController.AddNewUser);
router.post("/login-link", userController.SendEmailToUser);
router.post("/send-otp", userController.SendOTPCodeToUser);
router.post("/check-otp", userController.CheckOtpCode);

export default router;
