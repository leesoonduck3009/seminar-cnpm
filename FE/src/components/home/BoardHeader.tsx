import React from "react";
import {
  Star,
  Users,
  Layout,
  ChevronDown,
  Filter,
  Zap,
  AlignJustify,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BoardHeader = ({ title = "Bảng Trello của tôi" }) => {
  return (
    <header className="bg-pink-700 text-white p-2 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold flex items-center">
          {title}
          <Button variant="ghost" size="sm" className="ml-2 hover:bg-pink-600">
            <Star className="h-4 w-4" />
          </Button>
        </h1>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hover:bg-pink-600">
            <Users className="h-4 w-4 mr-1" />
            Workspace
          </Button>

          <div className="h-6 w-px bg-pink-600" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-pink-600">
                <Layout className="h-4 w-4 mr-1" />
                Bảng
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Calendar View</DropdownMenuItem>
              <DropdownMenuItem>Table View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="hover:bg-pink-600">
          <Filter className="h-4 w-4 mr-1" />
          Bộ lọc
        </Button>

        <div className="h-6 w-px bg-pink-600" />

        <Button variant="ghost" size="sm" className="hover:bg-pink-600">
          <Zap className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" className="hover:bg-pink-600">
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-pink-600" />

        <Button
          variant="secondary"
          size="sm"
          className="bg-pink-600 hover:bg-pink-500"
        >
          <Share className="h-4 w-4 mr-1" />
          Chia sẻ
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-pink-600">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Cài đặt bảng</DropdownMenuItem>
            <DropdownMenuItem>Thông tin về bảng</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default BoardHeader;
