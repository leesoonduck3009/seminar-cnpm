import { db } from "@/firebase/firebase";
import { Board } from "@/models/board";
import { Card } from "@/models/card";
import { List } from "@/models/list";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// Post
export const CreateCard = async (
  boardId: string,
  listId: string,
  card: Card
): Promise<Card> => {
  const cardRefCollection = collection(
    db,
    Board.name,
    boardId,
    List.name,
    listId,
    Card.name
  );
  const response = await addDoc(cardRefCollection, card.toJson());
  return card;
};
// Get
export const GetCardById = async (
  boardId: string,
  listId: string,
  cardId: string
): Promise<Card> => {
  const carDocRef = doc(db, Card.name, cardId);
  const dataSnapshot = await getDoc(carDocRef);
  const card = Card.fromJson(dataSnapshot.id, dataSnapshot.data());
  return card;
};
// Generate function to Get Card By Id in Firestore

// Update
export const UpdateCardPosition = async (
  boardId: string,
  currentListId: string,
  newListId: string,
  card: Card
): Promise<Card> => {
  const currentCardRef = doc(
    db,
    Board.name,
    boardId,
    List.name,
    currentListId,
    Card.name,
    card.id
  );
  const newCardRef = doc(
    db,
    Board.name,
    boardId,
    List.name,
    newListId,
    Card.name,
    card.id
  );
  const currentCardSnapshot = await getDoc(currentCardRef);
  const currentCardData = Card.fromJson(
    currentCardSnapshot.id,
    currentCardSnapshot.data()
  );
  await setDoc(newCardRef, currentCardData.toJson());
  await deleteDoc(currentCardRef);
  return card;  
};
export const UpdateCardList = async (card: Card): Promise<Card> => {
  throw new Error("Not implemnent");
};
export const AssignPeopleToCard = async (userId: string) => {
  throw new Error("Not implemnent");
};
export const UpateCardInformation = async (card: Card): Promise<Card> => {
  throw new Error("Not implemnent");
};
export const AssignLabelToCard = async (label: string): Promise<Card> => {
  throw new Error("Not implemnent");
};
// Delete
export const DeleteCard = async (cardId: string): Promise<Card> => {
  throw new Error("Not implemnent");
};
