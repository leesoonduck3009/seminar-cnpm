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
import * as AuthReactionService from "./services/reactionService/authReactionService";
import app from "./app";
import { createUser, CreateUserInput } from "./ultis/SeedingData";
exports.User = v2.https.onRequest(app);
exports.CreateUser = AuthReactionService.OnCreateUser;
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// Ví dụ gọi hàm để thêm user
const newUser: CreateUserInput = {
  email: "nguyenphucbinh445@gmail.com",
  password: "password123",
  displayName: "John Doe",
};

createUser(newUser)
  .then((userRecord) => {
    console.log("User created successfully:", userRecord);
  })
  .catch((error) => {
    console.error("Error creating user:", error);
  });
