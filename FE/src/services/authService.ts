import {
  CreateUserRequest,
  OptCheckRequest,
  UserRegisterResponse,
} from "@/models/auth";
import * as firebase from "../firebase/firebase";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { HttpService } from "./httpService";
import { ApiResponse } from "@/models/apiResponse";
import { use } from "react";
const httpService = new HttpService();
// Người dùng nhập send otp khi mới tạo tài khoản
export const RegisterUserSendOtp = async (
  email: string
): Promise<string | null> => {
  const result = await httpService.post<ApiResponse<string>>(
    "/User/api/send-otp",
    {
      email: email,
    }
  );
  return result.data ?? null;
};
// Người dùng nhập khi nhập OTP
export const RegisterUserCheckOtp = async (
  request: OptCheckRequest
): Promise<string | null> => {
  const result = await httpService.post<ApiResponse<string>>(
    "/User/api/check-otp",
    request
  );
  return result.data;
}; // return id
// Người dùng nhập thông tin tài khoản khi đăng sau khi đã nhập OTP
export const RegisterCreateUser = async (
  user: CreateUserRequest
): Promise<UserRegisterResponse | null> => {
  const result = await httpService.post<ApiResponse<UserRegisterResponse>>(
    "/User/api/create-user",
    user
  );
  if (result.data) await Login(result.data?.email, user.password);
  return result.data;
};
// Người dùng đăng nhập
export const Login = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebase.auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User signed in successfully:", user);
    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};
export const LoginByLinkRequest = async (email: string) => {
  const result = await httpService.post<ApiResponse<UserRegisterResponse>>(
    "/User/api/login-link",
    email
  );
  return result.data;
};
export const Logout = async () => {
  try {
    await signOut(firebase.auth); // Đăng xuất người dùng
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
