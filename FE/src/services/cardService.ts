// services/cardService.ts
import { db } from "@/helpers/firebase";
import { Card } from "@/types/card";
import { Column } from "@/types/column";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  DocumentReference,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";

const COLLECTION_NAME = "boards";

export class CardService {
  private static boardsRef = collection(db, COLLECTION_NAME);

  static async createCard(
    boardId: string,
    columnId: string,
    cardData: Partial<Card>
  ): Promise<Card> {
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

      // Create new card with all required fields
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: cardData.title || "",
        description: cardData.description || "",
        labels: cardData.labels || [],
        attachments: cardData.attachments || [],
        comments: cardData.comments || [],
        activities: cardData.activities || [],
        members: cardData.members || [],
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: cardData.createdBy || "",
        ...cardData,
      };

      // Add card to column
      columns[columnIndex].cards.push(newCard);

      // Update board document
      await updateDoc(boardRef, {
        columns,
        updatedAt: serverTimestamp(),
      });

      return newCard;
    } catch (error) {
      console.error("Error creating card:", error);
      throw new Error("Failed to create card");
    }
  }

  static async updateCard(
    boardId: string,
    columnId: string,
    cardId: string,
    data: Partial<Card>
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

      const cardIndex = columns[columnIndex].cards.findIndex(
        (card: Card) => card.id === cardId
      );

      if (cardIndex === -1) {
        throw new Error("Card not found");
      }

      // Update card
      const updatedCard = {
        ...columns[columnIndex].cards[cardIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      columns[columnIndex].cards[cardIndex] = updatedCard;

      // Update board document
      await updateDoc(boardRef, {
        columns,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating card:", error);
      throw new Error("Failed to update card");
    }
  }

  static async moveCard(
    boardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ): Promise<void> {
    const batch: WriteBatch = writeBatch(db);
    const boardRef = doc(this.boardsRef, boardId);

    try {
      const boardDoc = await getDoc(boardRef);

      if (!boardDoc.exists()) {
        throw new Error("Board not found");
      }

      const board = boardDoc.data();
      const columns = board.columns || [];

      const sourceColumnIndex = columns.findIndex(
        (col: Column) => col.id === sourceColumnId
      );
      const destinationColumnIndex = columns.findIndex(
        (col: Column) => col.id === destinationColumnId
      );

      if (sourceColumnIndex === -1 || destinationColumnIndex === -1) {
        throw new Error("Column not found");
      }

      // Remove card from source column
      const [movedCard] = columns[sourceColumnIndex].cards.splice(
        sourceIndex,
        1
      );

      // Add activity for the move
      movedCard.activities.push({
        id: `activity-${Date.now()}`,
        type: "move",
        content:
          sourceColumnId === destinationColumnId
            ? "reordered this card"
            : `moved from ${columns[sourceColumnIndex].title} to ${columns[destinationColumnIndex].title}`,
        createdAt: new Date().toISOString(),
      });

      // Insert card at destination
      columns[destinationColumnIndex].cards.splice(
        destinationIndex,
        0,
        movedCard
      );

      // Update board document
      await updateDoc(boardRef, {
        columns,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
    } catch (error) {
      console.error("Error moving card:", error);
      throw new Error("Failed to move card");
    }
  }

  static async deleteCard(
    boardId: string,
    columnId: string,
    cardId: string
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

      // Filter out the card to delete
      columns[columnIndex].cards = columns[columnIndex].cards.filter(
        (card: Card) => card.id !== cardId
      );

      // Update board document
      await updateDoc(boardRef, {
        columns,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error deleting card:", error);
      throw new Error("Failed to delete card");
    }
  }

  static async getCard(
    boardId: string,
    columnId: string,
    cardId: string
  ): Promise<Card> {
    try {
      const boardRef = doc(this.boardsRef, boardId);
      const boardDoc = await getDoc(boardRef);

      if (!boardDoc.exists()) {
        throw new Error("Board not found");
      }

      const board = boardDoc.data();
      const columns = board.columns || [];
      const column = columns.find((col: Column) => col.id === columnId);

      if (!column) {
        throw new Error("Column not found");
      }

      const card = column.cards.find((c: Card) => c.id === cardId);

      if (!card) {
        throw new Error("Card not found");
      }

      return card;
    } catch (error) {
      console.error("Error fetching card:", error);
      throw new Error("Failed to fetch card");
    }
  }
}
