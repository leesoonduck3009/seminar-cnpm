import { User } from "../models/user";
import { Firestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { UserLoginRequestDto } from "../models/dto/User/userLoginRequestDto";
import { UserLoginResponseDto } from "../models/dto/User/userLoginResonseDto";
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
export const registerUserAccount = async (
  user: UserRegisterDto
): Promise<UserRecord> => {
  const userReturn = await admin.auth().createUser(user);
  return userReturn;
};
export const loginUserAccount = async (
  user: UserLoginRequestDto
): Promise<UserLoginResponseDto> => {
  const userLogin = await admin.auth().getUserByEmail(user.email);
  return new UserLoginResponseDto(userLogin, "hello");
};
export const loginWithEmail = async (
  user: UserLoginRequestDto
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
  return await admin
    .auth()
    .generateSignInWithEmailLink(user.email, actionCodeSettings);
};
