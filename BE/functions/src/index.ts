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
exports.heavyFunction = v2.https.onRequest((req, res) => {
  // Lấy thời gian bắt đầu
  const startTime = process.hrtime.bigint();
  // Lấy RAM ban đầu
  const initialMemoryUsage = process.memoryUsage().heapUsed;
  // Tạo mảng lớn
  const largeArray = Array.from({ length: 1e6 }, () => Math.random());
  // Sắp xếp mảng
  const sortedArray = largeArray.sort((a, b) => b - a);
  // Lấy thời gian kết thúc
  const endTime = process.hrtime.bigint();
  // Lấy RAM sau khi xử lý
  const finalMemoryUsage = process.memoryUsage().heapUsed;
  const executionTime = Number(endTime - startTime) / 1e6;
  const memoryUsed = (finalMemoryUsage - initialMemoryUsage) / (1024 * 1024);
  // Xuất kết quả
  res.json({
    sortedArrayLength: sortedArray.length,
    executionTime: `${executionTime.toFixed(2)} ms`,
    memoryUsed: `${memoryUsed.toFixed(2)} MB`,
  });
});

exports.CreateUserReaction = firebaseFunction.auth
  .user()
  .onCreate(async (user, context) => {
    const uid = user.uid;
    const email = user.email || null;

    // Truy cập eventId từ context để theo dõi sự kiện
    const eventId = context.eventId;
    const retryRef = admin.firestore().collection("RetryCounts").doc(eventId);

    try {
      // Lấy thông tin số lần retry từ Firestore
      const retryDoc = await retryRef.get();
      let retryCount = 0;

      if (retryDoc.exists) {
        retryCount = retryDoc.data()?.count || 0;
      }

      // Kiểm tra nếu vượt quá số lần retry
      if (retryCount >= 3) {
        return null; // Dừng xử lý
      }

      // Thực hiện lưu thông tin người dùng
      await admin
        .firestore()
        .collection("Users")
        .doc(uid)
        .set({
          uid: uid,
          email: email,
          displayName: user.displayName || "",
          avatarURL: "", // Để trống avatar ban đầu
          boards: [], // Danh sách board trống ban đầu
        });

      await retryRef.delete();

      return null; // Add return statement
    } catch (error) {
      console.error(`Error processing user ${uid}:`, error);

      const retryDoc = await retryRef.get();
      let retryCount = 0;

      if (retryDoc.exists) {
        retryCount = retryDoc.data()?.count || 0;
      }

      await retryRef.set({
        count: retryCount + 1,
      });
      throw error;
    }
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
