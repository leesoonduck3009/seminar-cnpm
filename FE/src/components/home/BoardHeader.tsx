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
import { useBoards } from "@/contexts/BoardContext";

const BoardHeader = ({ title = "Bảng Trello của tôi" }) => {
  const { activeBoard } = useBoards();

  const getHeaderStyles = () => {
    if (!activeBoard) {
      return {
        header: "bg-pink-700",
        divider: "bg-pink-600",
        buttonHover: "hover:bg-pink-600",
        shareButton: "bg-pink-600 hover:bg-pink-500",
      };
    }

    if (activeBoard.backgroundImage) {
      return {
        header: "bg-black/50",
        divider: "bg-white/20",
        buttonHover: "hover:bg-white/20",
        shareButton: "bg-white/20 hover:bg-white/30",
      };
    }

    const baseColor = activeBoard.background.replace("bg-", "");
    return {
      header: `${activeBoard.background} brightness-75`,
      divider: "bg-white/20",
      buttonHover: "hover:bg-white/20",
      shareButton: "bg-white/20 hover:bg-white/30",
    };
  };

  const styles = getHeaderStyles();

  return (
    <header
      className={`${styles.header} text-white p-2 flex items-center justify-between w-full h-14 shrink-0`}
    >
      <div className="flex items-center space-x-4 min-w-0">
        <h1 className="text-lg font-semibold flex items-center truncate">
          <span className="truncate">{title}</span>
          <Button
            variant="ghost"
            size="sm"
            className={`ml-2 shrink-0 ${styles.buttonHover}`}
          >
            <Star className="h-4 w-4" />
          </Button>
        </h1>

        <div className="flex items-center space-x-2 shrink-0">
          <Button variant="ghost" size="sm" className={styles.buttonHover}>
            <Users className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Workspace</span>
          </Button>

          <div className={`h-6 w-px ${styles.divider} hidden sm:block`} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={styles.buttonHover}>
                <Layout className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Bảng</span>
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

      <div className="flex items-center space-x-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className={`${styles.buttonHover} hidden sm:flex`}
        >
          <Filter className="h-4 w-4 mr-1" />
          Bộ lọc
        </Button>

        <div className={`h-6 w-px ${styles.divider} hidden sm:block`} />

        <Button variant="ghost" size="sm" className={styles.buttonHover}>
          <Zap className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" className={styles.buttonHover}>
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className={`h-6 w-px ${styles.divider}`} />

        <Button variant="secondary" size="sm" className={styles.shareButton}>
          <Share className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className={styles.buttonHover}>
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
