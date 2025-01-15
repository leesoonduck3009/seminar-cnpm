"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HeaderHome from "@/components/home/HeaderHome";
import SideBar from "@/components/home/SideBar";
import Column from "@/components/home/ColumnComponent";
import BoardHeader from "@/components/home/BoardHeader";
import { StrictModeDroppable } from "@/components/StrictModeDroppable";
import useBoardStore, { useHydrateStore } from "@/store/useBoardStore";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Card } from "@/types/card";
import type { Board } from "@/types/board";
import { useAuth } from "@/contexts/AuthContext";

const LoadingState = () => (
  <div className="min-h-screen bg-pink-100">
    <HeaderHome />
    <div className="flex flex-col lg:flex-row">
      <SideBar className="w-full lg:w-64 flex-shrink-0" />
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    </div>
  </div>
);

const BoardNotFoundState = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-pink-100">
    <HeaderHome />
    <div className="flex flex-col lg:flex-row">
      <SideBar className="w-full lg:w-64 flex-shrink-0" />
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Board not found
          </h2>
          <p className="text-gray-500 mb-4">
            The board you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={onBack} variant="default">
            Go back to Boards
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const BoardDetailPage = () => {
  // Hooks and routing
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const boardId = params.id as string;
  const hydrated = useHydrateStore();
  const { currentUser, loading } = useAuth();

  // React.useEffect(() => {
  //   if (!currentUser) {
  //     router.push("/login");
  //   }
  // }, [currentUser, router]);
  // Local state
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // Store selectors
  const {
    boards,
    activeBoard,
    isLoading,
    setActiveBoardById,
    addColumn,
    updateColumn,
    deleteColumn,
    moveColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  } = useBoardStore();

  // Effect to load and initialize board data
  React.useEffect(() => {
    const initializeBoard = async () => {
      if (!hydrated || !boardId) return;

      const board = boards.find((b) => b.id === boardId);
      if (!board) {
        router.push("/boards");
        toast({
          title: "Error",
          description: "Board not found",
          variant: "destructive",
        });
        return;
      }

      await setActiveBoardById(boardId);
    };

    initializeBoard();

    return () => {
      console.log("cleanup");
    };
  }, [hydrated, boardId, boards]);

  // Background style handling
  const getBackgroundStyle = useCallback(() => {
    if (!activeBoard) return {};

    if (activeBoard.backgroundImage) {
      return {
        className:
          "bg-cover bg-center h-screen flex flex-col transition-all duration-300",
        style: {
          backgroundImage: `url(${activeBoard.backgroundImage})`,
        },
      };
    }

    return {
      className: `${activeBoard.background} h-screen flex flex-col transition-all duration-300`,
    };
  }, [activeBoard]);

  // Event handlers
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      if (type === "column") {
        moveColumn(boardId, source.index, destination.index);
        return;
      }

      moveCard(
        boardId,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    },
    [boardId, moveCard, moveColumn]
  );

  const handleAddColumn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newColumnTitle.trim() || isAddingColumn) return;

      setIsAddingColumn(true);
      try {
        await addColumn(boardId, newColumnTitle);
        setNewColumnTitle("");
        toast({
          title: "Success",
          description: "Column added successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add column",
          variant: "destructive",
        });
      } finally {
        setIsAddingColumn(false);
      }
    },
    [addColumn, boardId, isAddingColumn, newColumnTitle, toast]
  );

  const handleAddCard = useCallback(
    async (columnId: string, title: string) => {
      try {
        await addCard(boardId, columnId, { title });
        toast({
          title: "Success",
          description: "Card added successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add card",
          variant: "destructive",
        });
      }
    },
    [addCard, boardId, toast]
  );

  const handleUpdateCard = useCallback(
    (columnId: string, cardId: string, cardData: Partial<Card>) => {
      try {
        updateCard(boardId, columnId, cardId, cardData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update card",
          variant: "destructive",
        });
      }
    },
    [boardId, updateCard, toast]
  );

  const handleDeleteCard = useCallback(
    async (columnId: string, cardId: string) => {
      try {
        await deleteCard(boardId, columnId, cardId);
        toast({
          title: "Success",
          description: "Card deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete card",
          variant: "destructive",
        });
      }
    },
    [boardId, deleteCard, toast]
  );

  // Show loading state only during initial hydration
  if (!hydrated) {
    return <LoadingState />;
  }

  // Show not found state if board doesn't exist
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    return <BoardNotFoundState onBack={() => router.push("/boards")} />;
  }
  useEffect(() => {
    console.log("activeBoard", activeBoard);
  }, [activeBoard]);
  // Main render
  return loading ? (
    <div></div>
  ) : (
    <div
      className={cn(getBackgroundStyle().className)}
      style={getBackgroundStyle().style}
    >
      <HeaderHome />
      <div className="flex-1 flex overflow-hidden">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BoardHeader />
          <DragDropContext onDragEnd={handleDragEnd}>
            <main className="flex-1 p-4 overflow-x-auto overflow-y-auto">
              <StrictModeDroppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex gap-4 items-start min-h-[calc(100%-1rem)]"
                  >
                    {activeBoard &&
                      activeBoard!.columns.map((column, index) => (
                        <Column
                          key={column.id}
                          column={column}
                          index={index}
                          onAddCard={handleAddCard}
                          onUpdateCard={handleUpdateCard}
                          onDeleteCard={handleDeleteCard}
                          onUpdateColumn={(columnId, title) =>
                            updateColumn(boardId, columnId, { title })
                          }
                          onDeleteColumn={(columnId) =>
                            deleteColumn(boardId, columnId)
                          }
                        />
                      ))}
                    {provided.placeholder}

                    <div className="w-72 flex-shrink-0">
                      <div className="bg-white/50 hover:bg-white/80 transition-colors rounded-lg p-4 shadow">
                        <Input
                          placeholder="Enter list title..."
                          value={newColumnTitle}
                          onChange={(e) => setNewColumnTitle(e.target.value)}
                          className="mb-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newColumnTitle.trim()) {
                              handleAddColumn(e);
                            }
                          }}
                        />
                        <Button
                          onClick={handleAddColumn}
                          disabled={!newColumnTitle.trim() || isAddingColumn}
                          className="w-full flex items-center justify-center"
                          variant="secondary"
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add List
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </StrictModeDroppable>
            </main>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
