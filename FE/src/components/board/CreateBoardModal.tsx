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

const backgroundOptions = [
  { id: 1, color: "bg-[#0079bf]" },
  { id: 2, color: "bg-[#d29034]" },
  { id: 3, color: "bg-[#519839]" },
  { id: 4, color: "bg-[#b04632]" },
  { id: 5, color: "bg-[#89609e]" },
  { id: 6, color: "bg-[#cd5a91]" },
  { id: 7, color: "bg-[#4bbf6b]" },
  { id: 8, color: "bg-[#00aecc]" },
];

const imageBackgrounds = [
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
  // Add more image backgrounds as needed
];

const CreateBoardModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [selectedBackground, setSelectedBackground] = useState({
    type: "color",
    value: "bg-[#0079bf]",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onCreate({
        title,
        background: selectedBackground,
      });
      setTitle("");
      setSelectedBackground({ type: "color", value: "bg-[#0079bf]" });
      onClose();
    } catch (error) {
      console.error("Error creating board:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create board</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="mt-4">
          {/* Board Preview */}
          <div
            className={`w-full h-32 rounded-md mb-4 ${
              selectedBackground.type === "color"
                ? selectedBackground.value
                : ""
            }`}
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
                <h3 className="text-white font-medium">{title}</h3>
              </div>
            )}
          </div>

          {/* Board Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Board title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board title"
              className="w-full"
            />
          </div>

          {/* Background Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Background</label>
            <div className="grid grid-cols-4 gap-2">
              {backgroundOptions.map((bg) => (
                <button
                  key={bg.id}
                  className={`w-full h-12 rounded-md ${bg.color} ${
                    selectedBackground.value === bg.color
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedBackground({ type: "color", value: bg.color })
                  }
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Background Images
            </label>
            <div className="grid grid-cols-4 gap-2">
              {imageBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  className={`w-full h-12 rounded-md bg-cover bg-center ${
                    selectedBackground.value === bg.url
                      ? "ring-2 ring-blue-500"
                      : ""
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
            {isLoading ? "Creating..." : "Create board"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardModal;
