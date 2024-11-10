import React, { useState, useRef, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, X, Check, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const Card = ({ card, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  // Store the height when starting to drag for smooth animations
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.offsetHeight);
    }
  }, [card.content]);

  const handleUpdate = () => {
    if (editContent.trim() && editContent !== card.content) {
      onUpdate(editContent);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(card.content);
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            height: snapshot.isDragging ? height : "auto",
          }}
          className={cn(
            "mb-2 last:mb-0 group transition-transform",
            snapshot.isDragging && "rotate-[2deg] scale-[1.02]"
          )}
        >
          <div
            ref={contentRef}
            className={cn(
              "bg-white rounded-lg border shadow-sm hover:shadow-md transition-all",
              snapshot.isDragging &&
                "shadow-xl ring-2 ring-blue-400 ring-offset-2",
              !snapshot.isDragging && "hover:ring-1 hover:ring-blue-200"
            )}
          >
            {isEditing ? (
              <div className="p-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full min-h-[60px] p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus
                  placeholder="Enter a title for this card..."
                />
                <div className="flex justify-between items-center mt-2">
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={
                      !editContent.trim() || editContent === card.content
                    }
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(card.content);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 group relative min-h-[40px] flex items-start">
                <div
                  {...provided.dragHandleProps}
                  className={cn(
                    "opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity pr-2",
                    "cursor-grab active:cursor-grabbing",
                    snapshot.isDragging && "opacity-100"
                  )}
                >
                  <GripVertical className="w-4 h-4 mt-0.5" />
                </div>
                <div className="flex-1">
                  <p className="pr-16 text-sm break-words whitespace-pre-wrap">
                    {card.content}
                  </p>
                  <div
                    className={cn(
                      "absolute right-2 top-2 hidden group-hover:flex gap-1",
                      "bg-white/90 backdrop-blur-sm rounded-md shadow-sm",
                      "transition-opacity duration-200",
                      snapshot.isDragging && "hidden"
                    )}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={onDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
