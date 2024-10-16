import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();
router.get("/", userController.GetAllUser);
router.post("/", userController.AddNewUser);

export default router;
