import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();
router.get("/", userController.GetAllUser);
router.post("/", userController.AddNewUser);
router.post("/register", userController.RegisterUserAccount);
router.post("/login", userController.LoginUser);
router.post("/loginLink", userController.LoginUserWithLink);

export default router;
