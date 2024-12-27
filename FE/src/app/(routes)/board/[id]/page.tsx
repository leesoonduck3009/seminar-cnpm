"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HeaderHome from "@/components/home/HeaderHome";
import SideBar from "@/components/home/SideBar";
import Column from "@/components/home/ColumnComponent";
import BoardHeader from "@/components/home/BoardHeader";
import { StrictModeDroppable } from "../../home/StrictModeDroppable";
import { useBoards } from "@/contexts/BoardContext";
import { useParams } from "next/navigation";

const BoardDetailPage = () => {
  const params = useParams();
  const { setActiveBoardById, getBoardById, activeBoard } = useBoards();
  const [currentBoard, setCurrentBoard] = useState(null);

  const [columns, setColumns] = useState({
    "column-1": {
      id: "column-1",
      title: "To Do",
      cards: [
        { id: "card-1", content: "Task 1" },
        { id: "card-2", content: "Task 2" },
      ],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      cards: [],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      cards: [],
    },
  });
  const [columnOrder, setColumnOrder] = useState([
    "column-1",
    "column-2",
    "column-3",
  ]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // First useEffect to handle initial board loading and cleanup
  useEffect(() => {
    if (params.boardId) {
      const boardId = parseInt(params.boardId);
      const board = getBoardById(boardId);
      setCurrentBoard(board);
      setActiveBoardById(boardId);
    }

    return () => {
      setActiveBoardById(null);
      setCurrentBoard(null);
    };
  }, [params.boardId, getBoardById, setActiveBoardById]);

  // Second useEffect to keep currentBoard in sync with activeBoard
  useEffect(() => {
    if (activeBoard) {
      setCurrentBoard(activeBoard);
    }
  }, [activeBoard]);

  const getBackgroundStyle = () => {
    if (!currentBoard) {
      return {
        className:
          "bg-pink-100  transition-all duration-300 h-screen flex flex-col",
      };
    }

    if (currentBoard.backgroundImage) {
      return {
        className:
          "bg-cover bg-centerh-screen flex flex-col transition-all duration-300",
        style: {
          backgroundImage: currentBoard.backgroundImage,
        },
      };
    }

    return {
      className: `${currentBoard.background} h-screen flex flex-col transition-all duration-300`,
    };
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle column reordering
    if (type === "column") {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setColumnOrder(newColumnOrder);
      return;
    }

    // Handle card movement
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (sourceColumn === destColumn) {
      // Moving within the same column
      const newCards = Array.from(sourceColumn.cards);
      newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, sourceColumn.cards[source.index]);

      const newColumn = {
        ...sourceColumn,
        cards: newCards,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      // Moving to different column
      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);

      setColumns({
        ...columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          cards: sourceCards,
        },
        [destColumn.id]: {
          ...destColumn,
          cards: destCards,
        },
      });
    }
  };

  const addCard = (columnId, content) => {
    const newCard = {
      id: `card-${Date.now()}`,
      content,
    };

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: [...columns[columnId].cards, newCard],
      },
    });
  };

  const updateCard = (columnId, cardId, newContent) => {
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: columns[columnId].cards.map((card) =>
          card.id === cardId ? { ...card, content: newContent } : card
        ),
      },
    });
  };

  const deleteCard = (columnId, cardId) => {
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: columns[columnId].cards.filter((card) => card.id !== cardId),
      },
    });
  };

  const addColumn = (e) => {
    e.preventDefault(); // Prevent form submission
    if (!newColumnTitle.trim() || isAddingColumn) return;

    setIsAddingColumn(true); // Prevent multiple additions

    const newColumnId = `column-${Date.now()}`;
    setColumns((prevColumns) => ({
      ...prevColumns,
      [newColumnId]: {
        id: newColumnId,
        title: newColumnTitle,
        cards: [],
      },
    }));

    setColumnOrder((prevOrder) => [...prevOrder, newColumnId]);
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const updateColumn = (columnId, newTitle) => {
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        title: newTitle,
      },
    });
  };

  const deleteColumn = (columnId) => {
    const newColumns = { ...columns };
    delete newColumns[columnId];
    setColumns(newColumns);
    setColumnOrder(columnOrder.filter((id) => id !== columnId));
  };

  return (
    <div
      className={getBackgroundStyle().className}
      style={getBackgroundStyle().style}
    >
      <HeaderHome className="shrink-0" />
      <div className="flex-1 flex overflow-hidden">
        <SideBar className="w-64 shrink-0 hidden lg:block border-r" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BoardHeader title={currentBoard?.title || "Loading..."} />
          <DragDropContext onDragEnd={onDragEnd}>
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
                    {columnOrder.map((columnId, index) => {
                      const column = columns[columnId];
                      return (
                        <Column
                          key={column.id}
                          column={column}
                          index={index}
                          onAddCard={addCard}
                          onUpdateCard={updateCard}
                          onDeleteCard={deleteCard}
                          onUpdateColumn={updateColumn}
                          onDeleteColumn={deleteColumn}
                        />
                      );
                    })}
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
                              addColumn(e);
                            }
                          }}
                        />
                        <Button
                          onClick={addColumn}
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
