import * as firebaseFunction from "firebase-functions";
import admin = require("firebase-admin");
import { User } from "../../models/user";
export const OnCreateUser = firebaseFunction.auth.user().onCreate((user) => {
  const uid = user.uid;
  const email = user.email || null;
  const displayName = "";
  return admin.firestore().collection(User.name).doc(uid).set({
    uid: uid,
    email: email,
    displayName: displayName,
    avatarURL: "",
    boards: [],
    createdAt: new Date(),
    // Bất kỳ thông tin nào khác bạn muốn lưu trữ
  });
});
