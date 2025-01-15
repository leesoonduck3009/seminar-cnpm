"use client";
import React, { useEffect, useState } from "react";
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
import useBoardStore from "@/store/useBoardStore";
import type { Board } from "@/types/board";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { auth, db } from "@/helpers/firebase";
import { addDoc } from "firebase/firestore";
import { useBoards } from "@/hooks/use-board";
import { BoardService } from "@/services/boardService";

const BoardsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { boards, addBoard, updateBoard, setBoards, setIsLoading } =
    useBoardStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");
  const { currentUser, loading } = useAuth();
  const { allBoards } = useBoards();

  useEffect(() => {
    const fetchBoards = async () => {
      //   if (!currentUser) return;

      setIsLoading(true);
      try {
        const fetchedBoards = await BoardService.getBoards(
          auth.currentUser?.uid!
        );
        console.log("fetchedBoards" + fetchedBoards);
        setBoards(fetchedBoards);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch boards",
          variant: "destructive",
        });
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, [currentUser]);
  // React.useEffect(() => {
  //   if (!currentUser) {
  //     router.push("/login");
  //   }
  // }, [currentUser, router]);
  const handleCreateBoard = async (boardData: Partial<Board>) => {
    try {
      // // addBoard returns the new board immediately
      // const newBoard = addBoard(boardData);
      // // Wait for the next tick to ensure store is updated
      // await Promise.resolve();

      // if (!currentUser) throw new Error("No user found");

      const newAddBoard = await BoardService.createBoard(
        boardData,
        auth.currentUser?.uid!
      );

      useBoardStore.getState().addBoard(newAddBoard);

      // Navigate to the new board
      router.push(`/board/${newAddBoard.id}`);

      // Return the new board to satisfy the type

      return newAddBoard;

      // return newBoard;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create board",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleToggleStar = (boardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      updateBoard(boardId, { starred: !board.starred });
    }
  };

  const filteredBoards = React.useMemo(() => {
    console.log("allBoards", allBoards);
    let filtered = allBoards.filter((board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return filtered;
  }, [boards, searchQuery, sortBy]);

  return loading ? (
    <div></div>
  ) : (
    <div className="min-h-screen bg-pink-100">
      <HeaderHome />
      <div className="flex flex-col lg:flex-row">
        <SideBar className="w-full lg:w-64 flex-shrink-0" />
        <div className="flex-1 p-6">
          <h1 className="text-[#172B4D] text-2xl font-semibold mb-6">Bảng</h1>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Select
                defaultValue="recent"
                onValueChange={(value: "recent" | "name") => setSortBy(value)}
              >
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
                        backgroundImage: `url(${board.backgroundImage})`,
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
                    onClick={(e) => handleToggleStar(board.id, e)}
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
