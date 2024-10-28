import { User } from "@/models/user";

import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export const UpdateUserProfile = async (user: User): Promise<User> => {
  const userRef = doc(db, User.name, user.id);
  await setDoc(userRef, user.toJson(), { merge: true });
  return user;
};
export const GetProfileById = async (userId: string): Promise<User> => {
  const userRef = doc(db, User.name, userId);
  const response = await getDoc(userRef);
  const user: User = User.fromJson(response.data());
  user.id = response.id;
  return user;
};
export const updateUserPhoto = async (
  userPhotoUrl: string
): Promise<User | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No user is logged in");
  }
  try {
    // Bước 1: Cập nhật ảnh đại diện trong Firebase Authentication
    await updateProfile(currentUser, {
      photoURL: userPhotoUrl,
    });

    // Bước 2: Cập nhật ảnh đại diện trong Firestore
    const userDocRef = doc(db, User.name, currentUser.uid); // Assumes "users" collection contains user documents by UID
    await updateDoc(userDocRef, {
      photoURL: userPhotoUrl,
    });
    const user = await getDoc(userDocRef);
    const userData: User = user.data() as User;
    userData.id = user.id;
    // Trả về thông tin người dùng đã cập nhật
    return userData;
  } catch (error) {
    console.error("Error updating user photo:", error);
    throw new Error("Failed to update user photo");
  }
};
