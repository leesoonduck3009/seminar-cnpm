import { Request, Response } from "express";
import * as userService from "../services/userService";
import { User } from "../models/user";
import { ApiResponse } from "../models/dto/ApiResponse";
import { StatusCode } from "../enums/StatusCode";
import { UserLoginRequestDto } from "../models/dto/User/userLoginRequestDto";

export const AddNewUser = async (req: Request, res: Response) => {
  try {
    const newUser = req.body as Omit<
      User,
      "boards" | "id" | "createdAt" | "updatedAt"
    >;
    const user = await userService.createNewUser(newUser);
    res.status(200).json({ isSuccess: true, data: user, error: null });
  } catch (e) {
    res.status(500).json({ isSuccess: false, data: null, error: e });
  }
};
export const GetAllUser = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUser();
    res.status(200).json({ isSuccess: true, data: users, error: null });
  } catch (e) {
    res.status(500).json({ isSuccess: false, data: null, error: e });
  }
};
