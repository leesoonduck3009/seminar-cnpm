"use client";
import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HeaderHome from "@/components/home/HeaderHome";
import SideBar from "@/components/home/SideBar";
import Column from "@/components/home/ColumnComponent";
import BoardHeader from "@/components/home/BoardHeader";

const initialColumns = {
  "can-lam": {
    id: "can-lam",
    title: "Cần làm",
    cards: [
      { id: "1", content: "Lập kế hoạch dự án" },
      { id: "2", content: "Họp khởi động" },
      { id: "3", content: "hello" },
    ],
  },
  "dang-lam": {
    id: "dang-lam",
    title: "Đang làm",
    cards: [],
  },
  xong: {
    id: "xong",
    title: "Xong",
    cards: [],
  },
};

const HomePage = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Drop outside the list
    if (!destination) return;

    // Drop in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Get source and destination columns
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newCards = Array.from(sourceColumn.cards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      const newColumn = {
        ...sourceColumn,
        cards: newCards,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });

      return;
    }

    const sourceCards = Array.from(sourceColumn.cards);
    const [removed] = sourceCards.splice(source.index, 1);
    const destinationCards = Array.from(destColumn.cards);
    destinationCards.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [sourceColumn.id]: {
        ...sourceColumn,
        cards: sourceCards,
      },
      [destColumn.id]: {
        ...destColumn,
        cards: destinationCards,
      },
    });
  };

  const addCard = (columnId, content) => {
    const newCard = {
      id: Math.random().toString(36).substr(2, 9),
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

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    const columnId = newColumnTitle.toLowerCase().replace(/\s+/g, "-");
    setColumns({
      ...columns,
      [columnId]: {
        id: columnId,
        title: newColumnTitle,
        cards: [],
      },
    });
    setNewColumnTitle("");
  };

  return (
    <div className="min-h-screen bg-pink-100">
      <HeaderHome />
      <div className="flex flex-col lg:flex-row">
        <SideBar className="w-full lg:w-64 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <BoardHeader title="Bảng Taskly của tôi" />
          <main className="flex-1 p-4 lg:p-6 overflow-hidden">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-start w-full">
                  {Object.values(columns).map((column) => (
                    <Column
                      key={column.id}
                      column={column}
                      onAddCard={addCard}
                      onUpdateCard={updateCard}
                      onDeleteCard={deleteCard}
                    />
                  ))}

                  <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-lg p-4 shadow">
                      <Input
                        placeholder="Nhập tên danh sách mới..."
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        className="mb-2"
                      />
                      <Button
                        onClick={addColumn}
                        className="w-full flex items-center justify-center"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Thêm danh sách khác
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DragDropContext>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
