import { Board } from "@/models/board";

// Post
export const CreateBoard = async (board: Board): Promise<Board> => {
  throw new Error("Not implement");
};

// Get
export const GetAllBoard = async (userId: string): Promise<Board[]> => {
  throw new Error("Not implement");
};
export const GetBoardById = async (boardId: string): Promise<Board> => {
  throw new Error("Not implement");
};

// Put
export const UpdateInformationForBoard = async (
  board: Board
): Promise<Board> => {
  throw new Error("Not implement");
};
export const AssignPersonToBoard = async (userId: string[]): Promise<Board> => {
  throw new Error("Not implement");
};
export const SetRuleForBoard = async (rule: string[]): Promise<Board> => {
  throw new Error("Not implement");
};

// Delete
export const DeleteBoard = async (boardId: string): Promise<Board> => {
  throw new Error("Not implement");
};
