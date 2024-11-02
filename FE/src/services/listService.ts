import { db } from "@/firebase/firebase";
import { Board } from "@/models/board";
import { List, PositionChangeRequest } from "@/models/list";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

// Post
export const CreateList = async (
  list: List,
  boardId: string
): Promise<List> => {
  const boardRef = doc(db, Board.name, boardId);
  const listCollectionRef = collection(boardRef, List.name);
  const response = await addDoc(listCollectionRef, list.toJson());
  list.id = response.id;
  return list;
};

// Get

export const GetAllListInBoard = async (boardId: string): Promise<List[]> => {
  const boardRef = doc(db, Board.name, boardId);
  const listCollectionRef = collection(boardRef, List.name);
  const snapshot = await getDocs(listCollectionRef);
  const listResponse: List[] = [];
  snapshot.forEach((data) => {
    const listData = List.fromJson(data.id, data.data());
    listResponse.push(listData);
  });
  return listResponse;
};
export const GetListById = async (
  boardId: string,
  listId: string
): Promise<List> => {
  const listRef = doc(db, Board.name, boardId, List.name, listId);
  const snapshot = await getDoc(listRef);
  if (!snapshot.exists()) {
    throw new Error("Not found list");
  }
  const listData = List.fromJson(snapshot.id, snapshot.data());
  return listData;
  ``;
};
// Put
export const UpdateListInformation = async (
  boardId: string,
  list: List
): Promise<List> => {
  const listRef = doc(db, Board.name, boardId, List.name, list.id);
  await updateDoc(listRef, list.toJson());
  return list;
};
export const UpdateListPosition = async (
  boardId: string,
  listRequestPosition: PositionChangeRequest[]
) => {
  listRequestPosition.forEach(async (item) => {
    const listRef = doc(db, Board.name, boardId, List.name, item.listId);
    await updateDoc(listRef, { position: item.position });
  });
};
// Delete
export const DeleteList = async (boardId: string, listId: string) => {
  const listRef = doc(db, Board.name, boardId, List.name, listId);
  await deleteDoc(listRef);
};
