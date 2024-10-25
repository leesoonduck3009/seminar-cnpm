import { Card } from "@/models/card";

// Post
export const CreateCard = async (card: Card): Promise<Card> => {
  throw new Error("Not implement");
};
// Get
export const GetCardById = async (cardId: string): Promise<Card> => {
  throw new Error("Not implement");
};
// Update
export const UpdateCardPosition = async (card: Card): Promise<Card> => {
  throw new Error("Not implement");
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
