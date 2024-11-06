import { auth, db } from "@/firebase/firebase";
import { Board, UpdateInformationBoard } from "@/models/board";
import { User } from "@/models/user";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
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

// Get
export const GetAllBoard = async (): Promise<Board[]> => {
  const currentUser = auth.currentUser;
  if (currentUser === null) {
    throw new Error("Unauthorize");
  }
  const boardCollectionRef = collection(db, Board.name);
  const boardQuery = query(
    boardCollectionRef,
    where("ownerId", "==", currentUser.uid),
    where("isDeleted", "==", false)
  );
  const boardResponse: Board[] = [];
  const querySnapshot = await getDocs(boardQuery);
  querySnapshot.forEach((doc) => {
    const boardData = Board.fromJson(doc.id, doc.data());
    boardResponse.push(boardData);
  });
  return boardResponse;
  // const userRef = doc(db, User.name, currentUser.uid);
  // const userData = await getDoc(userRef);
  // const user = User.fromJson(userData.data());
  // const boardResponse = [];
  // user.boards.map(async(s)=>{
  //   const boardDocRef = doc(db,Board.name,s);
  //   const boardData = Board.fromJson(s,(await getDoc(boardDocRef)).data());
  //   boardResponse.push(boardData);
  // })
};
export const GetBoardById = async (boardId: string): Promise<Board> => {
  const boardDocRef = doc(db, Board.name, boardId);
  const boardSnapshot = await getDoc(boardDocRef);
  if (boardSnapshot === null)
    throw new Error(`Board with id ${boardId} not found`);
  const board: Board = Board.fromJson(boardSnapshot.id, boardSnapshot.data());
  return board;
};

// Put
export const UpdateNameForBoard = async (name: string, id: string) => {
  const boardDocRef = doc(db, Board.name, id);
  await updateDoc(boardDocRef, { name: name });
};
export const UpdateDescriptionForBoard = async (
  description: string,
  id: string
) => {
  const boardDocRef = doc(db, Board.name, id);
  await updateDoc(boardDocRef, { description: description });
};
export const AssignPersonToBoard = async (
  userIds: string[],
  boardId: string
): Promise<Board> => {
  const boardDocRef = doc(db, Board.name, boardId);
  await updateDoc(boardDocRef, { members: arrayUnion(...userIds) });
  const updatedBoard = await getDoc(boardDocRef);
  const response: Board = Board.fromJson(updatedBoard.id, updatedBoard.data());
  return response;
};
export const SetRuleForBoard = async (rule: string[]): Promise<Board> => {
  throw new Error("Not implement");
};

// Delete
export const DeleteBoard = async (boardId: string): Promise<Board> => {
  const boardDocRef = doc(db, Board.name, boardId);
  const board = await getDoc(boardDocRef);
  await updateDoc(boardDocRef, { isDeleted: true });
  return Board.fromJson(board.id, board.data());
};
