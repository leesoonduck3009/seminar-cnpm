import { db } from "@/helpers/firebase";
import { Board } from "@/types/board";
import { BoardMember } from "@/types/user";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";

const COLLECTION_NAME = "boards";

// Helper function to convert Firestore data to Board type
const convertToBoard = (
  doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
): Board => {
  const data = doc.data()!;
  return {
    ...data,
    id: doc.id,
    createdAt:
      data.createdAt?.toDate().toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
    members:
      data.members?.map((member: BoardMember) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        avatarUrl: member.avatarUrl,
        role: member.role,
        joinedAt: member.joinedAt,
      })) || [],
    columns: data.columns || [],
    labels: data.labels || [],
  } as Board;
};

export class BoardService {
  private static boardsRef = collection(db, COLLECTION_NAME);

  static async createBoard(
    boardData: Partial<Board>,
    userId: string
  ): Promise<Board> {
    try {
      // Create initial board member
      const initialMember: BoardMember = {
        id: userId,
        role: "admin",
        joinedAt: new Date().toISOString(),
        name: boardData.members?.[0]?.name || "",
        email: boardData.members?.[0]?.email || "",
        avatarUrl: boardData.members?.[0]?.avatarUrl || "",
      };

      // Prepare board data
      const newBoard = {
        ...boardData,
        createdBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        members: [initialMember],
        starred: false,
        visibility: boardData.visibility || "private",
        columns: [],
        labels: [
          { id: "label-1", name: "High Priority", color: "#ef4444" },
          { id: "label-2", name: "Medium Priority", color: "#f59e0b" },
          { id: "label-3", name: "Low Priority", color: "#10b981" },
        ],
      };

      // Create new document with auto-generated ID
      const docRef = doc(this.boardsRef);
      await setDoc(docRef, newBoard);

      // Return the created board with proper typing
      return {
        ...newBoard,
        id: docRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Board;
    } catch (error) {
      console.error("Error creating board:", error);
      throw new Error("Failed to create board");
    }
  }

  static async getBoards(userId: string): Promise<Board[]> {
    try {
      const q = query(
        this.boardsRef
        // where("members", "array-contains", { id: userId })
      );

      const querySnapshot = await getDocs(q);
      console.log("querySnapshot", querySnapshot);
      return querySnapshot.docs.map(convertToBoard);
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error("Failed to fetch boards");
    }
  }

  static async getBoardById(boardId: string): Promise<Board | null> {
    try {
      const boardRef = doc(this.boardsRef, boardId);
      const boardSnap = await getDoc(boardRef);

      if (!boardSnap.exists()) {
        return null;
      }

      return convertToBoard(boardSnap);
    } catch (error) {
      console.error("Error fetching board:", error);
      throw new Error("Failed to fetch board");
    }
  }
}
