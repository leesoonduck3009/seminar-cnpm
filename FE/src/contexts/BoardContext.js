"use client";
import { Board } from "@/models/board";
import { BoardService } from "@/services/boardService";
import { createContext, useContext, useState } from "react";

const BoardContext = createContext(null);

export const BoardProvider = ({ children }) => {
  const [firstBoard, setFirstBoard] = useState < Board > {};
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: "Bảng Trello của tôi",
      background: "bg-[#A95C90]",
      starred: false,
    },
    {
      id: 2,
      title: "Hehe",
      background: "bg-[#000000] bg-opacity-50",
      starred: false,
      backgroundImage:
        "url('https://images.unsplash.com/photo-1613336026275-d6d473084e85?q=80')",
    },
  ]);
  const [activeBoard, setActiveBoard] = useState(null);

  const addBoard = (boardData) => {
    const newBoard = {
      id: Date.now(),
      title: boardData.title,
      starred: false,
      ...(boardData.background.type === "color"
        ? { background: boardData.background.value }
        : { backgroundImage: `url('${boardData.background.value}')` }),
    };
    setBoards((prevBoards) => [...prevBoards, newBoard]);
    return newBoard;
  };

  const toggleBoardStar = (boardId) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId ? { ...board, starred: !board.starred } : board
      )
    );
  };

  const getBoardById = (boardId) => {
    return boards.find((board) => board.id === boardId);
  };

  const setActiveBoardById = async (boardId) => {
    const board = await BoardService.getBoardById(boardId);
    setActiveBoard(board);
  };
  const value = {
    boards,
    activeBoard,
    addBoard,
    toggleBoardStar,
    setActiveBoardById,
    getBoardById,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

export const useBoards = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoards must be used within a BoardProvider");
  }
  return context;
};
