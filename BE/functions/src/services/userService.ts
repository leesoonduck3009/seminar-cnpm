import { User } from "../models/user";
import { Firestore } from "firebase-admin/firestore";

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
