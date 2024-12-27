// app/boards/page.js
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeaderHome from "@/components/home/HeaderHome";
import SideBar from "@/components/home/SideBar";
import CreateBoardModal from "@/components/board/CreateBoardModal";
import { useRouter } from "next/navigation";
import { useBoards } from "@/contexts/BoardContext";

const BoardsPage = () => {
  const router = useRouter();
  const { boards, addBoard, toggleBoardStar } = useBoards();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateBoard = async (boardData) => {
    const newBoard = addBoard(boardData);
    router.push(`/board/${newBoard.id}`);
  };

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pink-100">
      <HeaderHome />
      <div className="flex flex-col lg:flex-row">
        <SideBar className="w-full lg:w-64 flex-shrink-0" />
        <div className="flex-1 p-6">
          <h1 className="text-[#172B4D] text-2xl font-semibold mb-6">Bảng</h1>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Select defaultValue="recent">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Hoạt động gần đây nhất</SelectItem>
                  <SelectItem value="name">Tên bảng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-[300px]">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                className="pl-8"
                placeholder="Tìm kiếm các bảng"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="h-24 bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <PlusIcon className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-600 mt-1">Tạo bảng mới</span>
              </div>
            </div>

            {filteredBoards.map((board) => (
              <div
                key={board.id}
                onClick={() => router.push(`/board/${board.id}`)}
                className={`h-24 rounded-lg relative cursor-pointer group ${board.background}`}
                style={
                  board.backgroundImage
                    ? {
                        backgroundImage: board.backgroundImage,
                        backgroundSize: "cover",
                      }
                    : {}
                }
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg">
                  <div className="p-3">
                    <h3 className="text-white font-medium">{board.title}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleBoardStar(board.id);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        board.starred
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <CreateBoardModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreateBoard}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardsPage;
