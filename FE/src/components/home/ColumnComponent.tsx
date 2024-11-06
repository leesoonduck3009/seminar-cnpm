import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Card from "@/components/home/CardComponent";

const Column = ({ column, onAddCard, onUpdateCard, onDeleteCard }) => {
  const [newCardContent, setNewCardContent] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      onAddCard(column.id, newCardContent);
      setNewCardContent("");
      setIsAddingCard(false);
    }
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white rounded-lg shadow">
        <div className="p-2 flex justify-between items-center border-b sticky top-0 bg-white z-10">
          <h3 className="font-medium">{column.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Đổi tên danh sách</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Xóa danh sách
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="p-2 min-h-[50px] max-h-[calc(100vh-300px)] overflow-y-auto"
            >
              {column.cards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  onUpdate={(newContent) =>
                    onUpdateCard(column.id, card.id, newContent)
                  }
                  onDelete={() => onDeleteCard(column.id, card.id)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="sticky bottom-0 bg-white border-t">
          {isAddingCard ? (
            <div className="p-2">
              <Input
                value={newCardContent}
                onChange={(e) => setNewCardContent(e.target.value)}
                placeholder="Nhập nội dung thẻ..."
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddCard} size="sm">
                  Thêm thẻ
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingCard(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center p-2 hover:bg-gray-100"
              onClick={() => setIsAddingCard(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Thêm thẻ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Column;
