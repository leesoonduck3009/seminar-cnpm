import { auth, db } from "@/helpers/firebase";
import { Board } from "@/models/boards/board";
import { User } from "@/models/users/user";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";

// Post
export const CreateBoard = async (board: Board): Promise<Board> => {
  // Create boarda
  const currentUser = auth.currentUser;
  if (currentUser === null) {
    throw new Error("Unauthorize");
  }
  board.ownerId = currentUser.uid;
  board.members = [currentUser.uid];
  const BoardCollectionRef = collection(db, Board.name);
  const boardRef = await addDoc(BoardCollectionRef, board);
  const userDoc = doc(db, User.name, currentUser.uid);
  await updateDoc(userDoc, { boards: arrayUnion(boardRef.id) });
  board.id = boardRef.id;
  return board;
};
