import * as firebaseFunction from "firebase-functions";
import admin = require("firebase-admin");
export class User {
  id: string; // ID người dùng (có thể là UID từ Firebase Authentication)
  displayName: string;
  email: string;
  avatarURL: string;
  boards: string[];
  createdAt: Date;
  updatedAt: Date;
  constructor(
    id: string,
    displayName: string,
    email: string,
    avatarURL: string,
    boards: string[],
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.displayName = displayName;
    this.email = email;
    this.avatarURL = avatarURL;
    this.boards = boards;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const OnCreateUser = firebaseFunction.auth.user().onCreate((user) => {
  const uid = user.uid;
  const email = user.email || null;
  return admin
    .firestore()
    .collection("Users")
    .doc(uid)
    .set({
      uid: uid,
      email: email,
      displayName: user.displayName || "",
      avatarURL: "",
      boards: [],
      createdAt: new Date(),
      // Bất kỳ thông tin nào khác bạn muốn lưu trữ
    });
});
