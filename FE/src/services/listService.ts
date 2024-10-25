import { List } from "@/models/list";

// Post
export const CreateList = async (list: List): Promise<List> => {
  throw new Error("Not implement");
};

// Get

export const GetAllListInBoard = async (boardId: string): Promise<List[]> => {
  throw new Error("Not implement");
};
export const GetAllListById = async (listId: string): Promise<List> => {
  throw new Error("Not implement");
};
// Put
export const UpdateListInformation = async (list: List): Promise<List> => {
  throw new Error("Not implement");
};
export const UpdateListPosition = async (list: List): Promise<List> => {
  throw new Error("Not implement");
};
// Delete
export const DeleteList = async (listId: string): Promise<List> => {
  throw new Error("Not implement");
};
