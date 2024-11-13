"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HeaderHome from "@/components/home/HeaderHome";
import SideBar from "@/components/home/SideBar";
import Column from "@/components/home/ColumnComponent";
import BoardHeader from "@/components/home/BoardHeader";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { useRouter } from "next/navigation";
import { auth } from "@/helpers/firebase";
import { User } from "firebase/auth";

const HomePage = () => {
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

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Giả sử bạn có Firebase Auth hoặc logic kiểm tra đăng nhập
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthUser(user);
      setIsLoading(false);
      console.log("User", user);
    });

    // Cleanup subscription khi component unmount
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!isLoading && !authUser) {
      // Nếu người dùng đã đăng nhập, điều hướng tới trang profile
      router.push("/login");
    }
  }, [authUser, isLoading, router]);
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

  return authUser ? (
    <div className="min-h-screen bg-pink-100">
      <HeaderHome />
      <div className="flex flex-col lg:flex-row">
        <SideBar className="w-full lg:w-64 flex-shrink-0" />
        <div className="flex-1">
          <BoardHeader title="My Taskly Board" />
          <DragDropContext onDragEnd={onDragEnd}>
            <main className="p-4 lg:p-6 overflow-x-auto">
              <StrictModeDroppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex gap-4 items-start min-h-[calc(100vh-200px)]"
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
                              addColumn();
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
  ) : null;
};

export default HomePage;
