import { db } from "../helpers/firebase";
import { Board } from "@/models/board";
import { List, PositionChangeRequest } from "@/models/list";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
type ChangeType = "added" | "modified" | "removed";

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
export const listenToListsInBoard = (
  boardId: string, // ID của bảng cần lắng nghe
  callback: (type: ChangeType, data: any) => void // Callback để xử lý dữ liệu khi có thay đổi
): (() => void) => {
  // Truy vấn tất cả các list trong bảng có boardId = boardId
  const q = query(collection(db, "lists"), where("boardId", "==", boardId));

  // Lắng nghe các thay đổi của collection qua onSnapshot
  const unsubscribe = onSnapshot(q, (snapshot) => {
    // Duyệt qua các thay đổi trong snapshot
    snapshot.docChanges().forEach((change) => {
      // Xử lý các thay đổi (thêm, sửa, xóa)
      if (change.type === "added") {
        callback("added", change.doc.data()); // Gọi callback khi có thêm mới
      }
      if (change.type === "modified") {
        callback("modified", change.doc.data()); // Gọi callback khi có sửa đổi
      }
      if (change.type === "removed") {
        callback("removed", change.doc.data()); // Gọi callback khi có xóa
      }
    });
  });

  // Trả về hàm unsubscribe để dừng lắng nghe khi không còn cần thiết
  return unsubscribe;
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
