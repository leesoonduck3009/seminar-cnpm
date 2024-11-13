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
import {
  CreateNewPasswordUser,
  CreateNewUserDetail,
} from "./services/userService";
exports.User = v2.https.onRequest(app);
exports.CreateUserReaction = AuthReactionService.OnCreateUser;
exports.CreatePasswordUser = v2.https.onCall(CreateNewPasswordUser);
exports.CreateUserDetail = v2.https.onCall(CreateNewUserDetail);
admin.initializeApp();
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
