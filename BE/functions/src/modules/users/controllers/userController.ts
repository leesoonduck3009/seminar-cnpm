import { Request, Response } from "express";
import * as userService from "../services/userService";
import { User } from "../models/User/user";
import { OptCheckRequest } from "../models/OtpCheckDto";
import { ApiResponse } from "../models/ApiResponse";
// import { UserRegisterDetail } from "../models/dto/User/userRegisteDetailDto";
// import { ApiResponse } from "../models/dto/ApiResponse";
// import { StatusCode } from "../enums/StatusCode";
// import { UserLoginRequestDto } from "../models/dto/User/userLoginRequestDto";

export const AddNewUser = async (req: Request, res: Response) => {
  const newUser = req.body as Omit<
    User,
    "boards" | "id" | "createdAt" | "updatedAt"
  >;
  const user = await userService.createNewUser(newUser);
  res.status(200).json({ isSuccess: true, data: user, error: null });
};
export const GetAllUser = async (req: Request, res: Response) => {
  const users = await userService.getAllUser();
  res.status(200).json({ isSuccess: true, data: users, error: null });
};
export const SendEmailToUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const response = new ApiResponse(
      await userService.SendLinkLoginUserToEmail(email),
      true,
      null,
      200
    );
    res.status(200).json(response);
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred";
    const response = new ApiResponse(await null, false, errorMessage, 500);
    res.status(500).json(response);
  }
};
export const SendOTPCodeToUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  const response = new ApiResponse(
    await userService.SendOTPCheckingEmail(email),
    true,
    null,
    200
  );
  res.status(200).json(response);
};
export const CheckOtpCode = async (req: Request, res: Response) => {
  try {
    const request = req.body as OptCheckRequest;
    const response = new ApiResponse(
      await userService.CheckOTPRegister(request),
      true,
      null,
      200
    );
    res.status(200).json(response);
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred";
    const response = new ApiResponse(await null, false, errorMessage, 500);
    res.status(500).json(response);
  }
};
export const CreateUserAccount = async (req: Request, res: Response) => {
  // const request = req.body as UserRegisterDetail;
  const response = new ApiResponse(
    // await userService.CreateNewUser(request),
    null,
    true,
    null,
    200
  );
  res.status(200).json(response);
};
