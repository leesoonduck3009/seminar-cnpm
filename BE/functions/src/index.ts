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
import * as path from "path";
import * as fs from "fs";
import {
  CreateNewPasswordUser,
  CreateNewUserDetail,
} from "./modules/users/services/userService";
import dotenv from "dotenv";
import axios from "axios";
const url =
  "https://firebasestorage.googleapis.com/v0/b/project-management-f27b0.firebasestorage.app/o/service.json?alt=media&token=07020915-9021-4d1a-be6c-8946d168e7da";
const serviceAccountPath = path.join(__dirname, "service.json");
async function downloadServiceAccountJson() {
  try {
    // Tải tệp JSON từ URL
    const response = await axios.get(url, { responseType: "stream" });

    // Lưu tệp JSON vào đĩa
    const writer = fs.createWriteStream(serviceAccountPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      console.log("Tệp service.json đã được tải và lưu thành công!");
      // Sau khi tải tệp xong, phân tích cú pháp và sử dụng nó
      initializeFirebaseAdmin();
    });
  } catch (error) {
    console.error("Lỗi khi tải tệp JSON:", error);
  }
}
function initializeFirebaseAdmin() {
  try {
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );
    // Khởi tạo Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    console.log("Firebase Admin SDK đã được khởi tạo thành công!");
  } catch (error) {
    console.error("Lỗi khi khởi tạo Firebase Admin:", error);
  }
}
// Load environment variables from .env file
dotenv.config();
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
downloadServiceAccountJson();
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
