"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Board } from "@/types/board";

interface BackgroundOption {
  id: number;
  color: string;
}

interface ImageBackground {
  id: number;
  url: string;
  thumbnail: string;
}

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (boardData: Partial<Board>) => Promise<Board>;
}

const backgroundOptions: BackgroundOption[] = [
  { id: 1, color: "bg-[#0079bf]" },
  { id: 2, color: "bg-[#d29034]" },
  { id: 3, color: "bg-[#519839]" },
  { id: 4, color: "bg-[#b04632]" },
  { id: 5, color: "bg-[#89609e]" },
  { id: 6, color: "bg-[#cd5a91]" },
  { id: 7, color: "bg-[#4bbf6b]" },
  { id: 8, color: "bg-[#00aecc]" },
];

const imageBackgrounds: ImageBackground[] = [
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?q=80&w=100",
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1682686580391-615b1e32be1f?q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1682686580391-615b1e32be1f?q=80&w=100",
  },
];

type Background = {
  type: "color" | "image";
  value: string;
};

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [selectedBackground, setSelectedBackground] = useState<Background>({
    type: "color",
    value: "bg-[#0079bf]",
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSelectedBackground({ type: "color", value: "bg-[#0079bf]" });
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a board title",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const boardData: Partial<Board> = {
        title: title.trim(),
        ...(selectedBackground.type === "color"
          ? { background: selectedBackground.value }
          : { backgroundImage: selectedBackground.value }),
        visibility: "private",
        columns: [],
        members: [],
        labels: [
          { id: "label-1", name: "High Priority", color: "#ef4444" },
          { id: "label-2", name: "Medium Priority", color: "#f59e0b" },
          { id: "label-3", name: "Low Priority", color: "#10b981" },
        ],
      };

      await onCreate(boardData);
      toast({
        title: "Success",
        description: "Board created successfully",
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating board:", error);
      toast({
        title: "Error",
        description: "Failed to create board",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Tạo bảng</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          ></button>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Board Preview */}
          <div
            className={`w-full h-32 rounded-md ${
              selectedBackground.type === "color"
                ? selectedBackground.value
                : ""
            } transition-all duration-200`}
            style={
              selectedBackground.type === "image"
                ? {
                    backgroundImage: `url(${selectedBackground.value})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            {title && (
              <div className="p-4">
                <h3 className="text-white font-medium break-words">{title}</h3>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tên bảng <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tên bảng"
              className="w-full"
              autoFocus
            />
          </div>

          {/* Background Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Màu nền</label>
            <div className="grid grid-cols-4 gap-2">
              {backgroundOptions.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  className={`w-full h-12 rounded-md ${
                    bg.color
                  } transition-all duration-200 ${
                    selectedBackground.type === "color" &&
                    selectedBackground.value === bg.color
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-blue-200 hover:ring-offset-1"
                  }`}
                  onClick={() =>
                    setSelectedBackground({ type: "color", value: bg.color })
                  }
                />
              ))}
            </div>
          </div>

          {/* Background Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Ảnh nền</label>
            <div className="grid grid-cols-4 gap-2">
              {imageBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  className={`w-full h-12 rounded-md bg-cover bg-center transition-all duration-200 ${
                    selectedBackground.type === "image" &&
                    selectedBackground.value === bg.url
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-blue-200 hover:ring-offset-1"
                  }`}
                  style={{ backgroundImage: `url(${bg.thumbnail})` }}
                  onClick={() =>
                    setSelectedBackground({ type: "image", value: bg.url })
                  }
                />
              ))}
            </div>
          </div>

          {/* Create Button */}
          <Button
            className="w-full"
            onClick={handleCreate}
            disabled={!title.trim() || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang tạo...
              </span>
            ) : (
              "Tạo bảng"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardModal;
