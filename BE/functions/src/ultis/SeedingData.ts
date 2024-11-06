import admin from "firebase-admin"; // Nhập cấu hình firebaseAdmin từ file cấu hình trên
import { User } from "../models/user";

export interface CreateUserInput {
  email: string;
  password: string;
  displayName: string;
}

export const createUser = async ({
  email,
  password,
  displayName,
}: CreateUserInput): Promise<admin.auth.UserRecord> => {
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: true,
    });
    await admin.firestore().collection(User.name).doc(userRecord.uid).set(
      {
        displayName: userRecord.displayName,
        boards: [],
      },
      { merge: true }
    );
    console.log("Successfully created new user:", userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
};
