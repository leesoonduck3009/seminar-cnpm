import { User } from "../models/user";
import { Firestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import dotenv from "dotenv";
import * as mailService from "./mailService";
import { OTPCheckRegister } from "../models/otpCheck";
import { OptCheckRequest, OptCheckResponse } from "../models/dto/OtpCheckDto";
import {
  InvalidModelError,
  NotFoundError,
  UnauthorizeError,
} from "../Errors/errors";
dotenv.config();
const db = new Firestore();
export const createNewUser = async (
  data: Omit<User, "boards" | "id" | "createdAt" | "updatedAt">
): Promise<User> => {
  const newUser: User = {
    ...data,
    id: new Date().toLocaleTimeString(),
    boards: [] as string[],
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  await db.collection("users").doc(newUser.id).set(newUser);
  return newUser;
};
export const getAllUser = async (): Promise<User[]> => {
  const users: User[] = [];
  const snapshots = await db.collection("users").get();
  snapshots.forEach((doc) => {
    const user = doc.data() as User;
    users.push(user);
  });
  return users;
};
export const SendLinkLoginUserToEmail = async (
  email: string
): Promise<string> => {
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for
    // this URL must be whitelisted in the Firebase Console.
    url: "https://www.facebook.com/",
    // This must be true for email link sign-in.
    handleCodeInApp: true,
    iOS: {
      bundleId: "com.example.ios",
    },
    android: {
      packageName: "com.example.android",
      installApp: true,
      minimumVersion: "12",
    },
    // FDL custom domain.
    dynamicLinkDomain: "coolapp.page.link",
  };
  const url = await admin
    .auth()
    .generateSignInWithEmailLink(email, actionCodeSettings);
  await mailService.sendLoginEmail(email, url);
  return url;
};
export const SendOTPCheckingEmail = async (email: string): Promise<string> => {
  const OTP = generateOTP();
  const oTPCheck = new OTPCheckRegister(OTP, email);
  // const userSnapshot = await admin
  //   .firestore()
  //   .collection(User.name)
  //   .where("email", "==", email)
  //   .get();
  // if (!userSnapshot.empty) {
  //   throw new ConflictError(`User ${email} existed`);
  // }
  // Generate check User existed
  // Check if user existed
  // const user = await admin.auth().getUserByEmail(email);
  // if (user !== null) {
  //   throw new ConflictError(`User ${email} existed`);
  // }
  await mailService.sendMailOTP(email, OTP);
  await admin
    .firestore()
    .collection(OTPCheckRegister.name)
    .doc(email)
    .set(oTPCheck.toJson());
  return email;
};
export const CheckOTPRegister = async (
  request: OptCheckRequest
): Promise<OptCheckResponse> => {
  console.log("Mã OTP");
  const doc = await admin
    .firestore()
    .collection(OTPCheckRegister.name)
    .doc(request.email)
    .get();
  const dataResponse = doc.data();
  if (!dataResponse) {
    // Nếu không tìm thấy OTP, trả về false
    throw new NotFoundError("OTP request Not found");
  }
  // Chuyển dữ liệu từ Firestore về dạng OTPCheck
  const otpCheck = OTPCheckRegister.fromJson(dataResponse);
  // Kiểm tra mã OTP đã hết hạn chưa
  if (otpCheck.isExpired()) {
    console.log("Mã OTP đã hết hạn.");
    throw new InvalidModelError("OTP code is expired");
  }

  // Kiểm tra xem mã OTP đã được sử dụng chưa
  if (otpCheck.isAlreadyUsed()) {
    throw new InvalidModelError("OTP code already used");
  }

  // Kiểm tra xem mã OTP đã vượt quá số lần thử nhập sai chưa
  if (otpCheck.isMaxAttemptsReached()) {
    console.log("Số lần thử đã vượt quá giới hạn.");
    throw new InvalidModelError("Over Attempts Reached");
  }
  // Kiểm tra mã OTP mà người dùng nhập
  if (otpCheck.OtpCode !== request.OtpCode) {
    otpCheck.incrementAttempts(); // Tăng số lần thử
    // Cập nhật lại số lần thử vào Firestore
    await admin
      .firestore()
      .collection(OTPCheckRegister.name)
      .doc(request.email)
      .update({
        Attempts: otpCheck.Attempts,
      });
    console.log("Mã OTP không đúng.");
    throw new NotFoundError("Otp code is not correct");
  }
  // Nếu mã OTP chính xác, đánh dấu là đã sử dụng
  otpCheck.useOTP();
  await admin
    .firestore()
    .collection(OTPCheckRegister.name)
    .doc(request.email)
    .update({
      IsUsed: otpCheck.IsUsed,
    });
  // Tạo tài khoản người dùng
  const userRecord = await admin.auth().createUser({
    email: request.email,
    emailVerified: true,
  });
  console.log("Mã OTP hợp lệ.");
  const token = await admin.auth().createCustomToken(userRecord.uid);
  return new OptCheckResponse(userRecord.uid, token);
};
function generateOTP(length = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString(); // Chọn ngẫu nhiên từ '0' đến '9'
  }
  return otp;
}

export const CreateNewPasswordUser = async (request: any) => {
  if (!request.auth) {
    throw new UnauthorizeError("Unauthorize");
  }
  console.log("auth", request.auth);
  const user = await admin
    .auth()
    .updateUser(request.auth.uid, { password: request.data.password });
  // await admin.firestore().collection(User.name).doc(request.auth.uid).set(
  //   {
  //     displayName: request.data.displayName,
  //   },
  //   { merge: true }
  // );
  return user;
};
export const CreateNewUserDetail = async (request: any) => {
  if (!request.auth) {
    throw new UnauthorizeError("Unauthorize");
  }
  // Cập nhật displayName cho Firestore
  await admin.firestore().collection(User.name).doc(request.auth.uid).set(
    {
      displayName: request.data.displayName,
    },
    { merge: true }
  );
  // Sử dụng merge để chỉ cập nhật displayName mà không ghi đè toàn bộ document
};
