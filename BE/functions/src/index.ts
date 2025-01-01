/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import admin = require("firebase-admin");
import * as v2 from "firebase-functions/v2";
import * as firebaseFunction from "firebase-functions";
import * as userController from "./modules/users/controllers/userController";
import app from "./app";
import cors from "cors";
import {
  CreateNewPasswordUser,
  CreateNewUserDetail,
} from "./modules/users/services/userService";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
console.log("serviceAccount", process.env.SERVICE_ACCOUNT_KEY!);
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY!);
// Đảm bảo kiểu của serviceAccount là ServiceAccount
app.use(cors({ origin: true }));
exports.SendMailToUser = v2.https.onRequest(
  { cors: true },
  userController.SendEmailToUser
);
exports.Test = v2.https.onRequest({ cors: true }, (req, res) => {
  res.send("Hello from firebase");
});
exports.SendOTPCodeToUser = v2.https.onRequest(
  { cors: true },
  userController.SendOTPCodeToUser
);
exports.CheckOtpCode = v2.https.onRequest(
  { cors: true },
  userController.CheckOtpCode
);
exports.CreateUserAccount = v2.https.onRequest(
  { cors: true },
  userController.CreateUserAccount
);
exports.CreateUserReaction = firebaseFunction.auth.user().onCreate((user) => {
  const uid = user.uid;
  const email = user.email || null;

  // Truy cập Firestore để lưu thông tin người dùng
  return admin
    .firestore()
    .collection("Users")
    .doc(uid)
    .set({
      uid: uid,
      email: email,
      displayName: user.displayName || "",
      avatarURL: "", // Để trống avatar ban đầu
      boards: [], // Danh sách board trống ban đầu
      // Bạn có thể thêm các thông tin khác ở đây nếu cần
    });
});
exports.CreatePasswordUser = v2.https.onCall(CreateNewPasswordUser);
exports.CreateUserDetail = v2.https.onCall(CreateNewUserDetail);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
