import { ApiResponse } from "@/models/apiResponse";
import { HttpService } from "./httpService";
import {
  CreateUserRequest,
  OptCheckRequest,
  UserRegisterResponse,
} from "@/models/auths/auth";
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseFunction } from "@/helpers/firebase";
import { httpsCallable } from "firebase/functions";
import { OptCheckResponse } from "@/models/auths/dtos/OtpCheckDto";

const httpService = new HttpService();
// Người dùng nhập send otp khi mới tạo tài khoản
export const RegisterUserSendOtp = async (
  email: string
): Promise<ApiResponse<string>> => {
  try {
    const result = await httpService.post<ApiResponse<string>>(
      "/User/api/send-otp",
      {
        email: email,
      }
    );
    console.log(result);
    return result;
  } catch (error: any) {
    console.log(error);
    const response: ApiResponse<string> = new ApiResponse<string>(
      null,
      false,
      error.message,
      500
    );
    return response;
  }
};

// Người dùng nhập khi nhập OTP
export const RegisterUserCheckOtp = async (
  request: OptCheckRequest
): Promise<ApiResponse<OptCheckResponse>> => {
  try {
    const result = await httpService.post<ApiResponse<OptCheckResponse>>(
      "/User/api/check-otp",
      request
    );
    if (result.statusCode === 200) {
      const userCredential = await signInWithCustomToken(
        auth,
        result.data!.token
      );
      localStorage.setItem("token", result.data!.token);
      console.log("User logged in successfully", auth.currentUser);
    }
    return result;
  } catch (error: any) {
    const response: ApiResponse<OptCheckResponse> =
      new ApiResponse<OptCheckResponse>(null, false, error.message, 500);
    return response;
  }
}; // return id
// Người dùng nhập thông tin password khi đăng ký
export const RegisterUserCreatePassword = async (
  password: string
): Promise<ApiResponse<string>> => {
  try {
    const result = await httpsCallable(
      firebaseFunction,
      "CreatePasswordUser"
    )({
      password: password,
    });
    const email = localStorage.getItem("email")!;
    signInWithEmailAndPassword(auth, email, password);
    console.log(result);
    return new ApiResponse<string>("success", true, "Success", 200);
  } catch (error: any) {
    const response: ApiResponse<string> = new ApiResponse<string>(
      null,
      false,
      error.message,
      500
    );
    return response;
  }
};
// Người dùng nhập thông tin password khi đăng ký
export const RegisterUserCreateDetail = async (
  displayName: string
): Promise<boolean> => {
  if (!auth.currentUser) {
    const token = localStorage.getItem("token");
    await signInWithCustomToken(auth, token!);
    if (!auth.currentUser) throw new Error("Unauthenticated");
  }
  if (auth.currentUser.uid)
    await updateProfile(auth.currentUser, {
      displayName: displayName,
    });
  return true;
};
// Người dùng nhập thông tin tài khoản khi đăng sau khi đã nhập OTP
// export const RegisterCreateUser = async (
//   user: CreateUserRequest
// ): Promise<UserRegisterResponse | null> => {
//   const result = await httpService.post<ApiResponse<UserRegisterResponse>>(
//     "/User/api/create-user",
//     user
//   );
//   if (result.data) await Login(result.data?.email, user.password);
//   return result.data;
// };
export const Login = async (email: string, password: string): Promise<any> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in successfully", auth.currentUser);
    const user = userCredential.user;
    return user;
  } catch (error: any) {
    // Log chi tiết mã lỗi và thông báo lỗi
    console.error("Error signing in:");
    console.error(`Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
  }
};
export const Logout = async () => {
  try {
    await signOut(auth); // Đăng xuất người dùng
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
