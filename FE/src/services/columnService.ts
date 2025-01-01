// services/columnService.ts
import { db } from "@/helpers/firebase";
import { Column } from "@/types/column";
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "boards";

export class ColumnService {
  private static boardsRef = collection(db, COLLECTION_NAME);

  static async createColumn(boardId: string, title: string): Promise<Column> {
    try {
      const boardRef = doc(this.boardsRef, boardId);
      const boardDoc = await getDoc(boardRef);

      if (!boardDoc.exists()) {
        throw new Error("Board not found");
      }

      // Create new column
      const newColumn: Column = {
        id: `column-${Date.now()}`,
        title,
        cards: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update board document with new column
      await updateDoc(boardRef, {
        columns: arrayUnion(newColumn),
        updatedAt: serverTimestamp(),
      });

      return newColumn;
    } catch (error) {
      console.error("Error creating column:", error);
      throw new Error("Failed to create column");
    }
  }

  static async updateColumn(
    boardId: string,
    columnId: string,
    data: Partial<Column>
  ): Promise<void> {
    try {
      const boardRef = doc(this.boardsRef, boardId);
      const boardDoc = await getDoc(boardRef);

      if (!boardDoc.exists()) {
        throw new Error("Board not found");
      }

      const board = boardDoc.data();
      const columns = board.columns || [];
      const columnIndex = columns.findIndex(
        (col: Column) => col.id === columnId
      );

      if (columnIndex === -1) {
        throw new Error("Column not found");
      }

      // Update column
      const updatedColumn = {
        ...columns[columnIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      columns[columnIndex] = updatedColumn;

      // Update board document
      await updateDoc(boardRef, {
        columns,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating column:", error);
      throw new Error("Failed to update column");
    }
  }

  static async deleteColumn(boardId: string, columnId: string): Promise<void> {
    try {
      const boardRef = doc(this.boardsRef, boardId);
      const boardDoc = await getDoc(boardRef);

      if (!boardDoc.exists()) {
        throw new Error("Board not found");
      }

      const board = boardDoc.data();
      const columnToDelete = board.columns.find(
        (col: Column) => col.id === columnId
      );

      if (!columnToDelete) {
        throw new Error("Column not found");
      }

      // Remove column from board
      await updateDoc(boardRef, {
        columns: arrayRemove(columnToDelete),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error deleting column:", error);
      throw new Error("Failed to delete column");
    }
  }

  static async moveColumn(boardId: string, columns: Column[]): Promise<void> {
    try {
      const boardRef = doc(this.boardsRef, boardId);
      const boardDoc = await getDoc(boardRef);

      if (!boardDoc.exists()) {
        throw new Error("Board not found");
      }

      // Update board with new column order
      await updateDoc(boardRef, {
        columns,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error moving column:", error);
      throw new Error("Failed to move column");
    }
  }
}
