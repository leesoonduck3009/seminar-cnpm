"use client";
import { useEffect } from "react";
import BoardIcon from "@/components/icons/BoardIcon";
import MemberIcon from "@/components/icons/MemberIcon";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useBoards } from "@/contexts/BoardContext";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const { boards, activeBoard, setActiveBoardById } = useBoards();
  const pathname = usePathname();

  useEffect(() => {
    // Extract board ID from pathname
    const boardIdMatch = pathname.match(/\/board\/(\d+)/);
    if (boardIdMatch) {
      const boardId = parseInt(boardIdMatch[1]);
      setActiveBoardById(boardId);
    } else {
      setActiveBoardById(null);
    }
  }, [pathname, setActiveBoardById]);

  const getSidebarStyle = () => {
    if (!activeBoard) {
      return "bg-[#9F246E]";
    }

    if (activeBoard.backgroundImage) {
      return `bg-black bg-opacity-50`;
    }

    return activeBoard.background;
  };

  const getLinkStyle = (boardId) => {
    const isActive = activeBoard?.id === boardId;
    return `flex cursor-pointer px-4 py-2 ${
      isActive ? "bg-white/30" : "hover:bg-white hover:bg-opacity-20"
    } gap-[10px] items-center`;
  };

  return (
    <div
      className={`w-[280px] flex-shrink-0 ${getSidebarStyle()} border-r border-t border-opacity-20 border-[#d5d5d5] h-screen flex flex-col transition-colors duration-300`}
    >
      <div className="flex py-3 px-4 border-b border-opacity-20 border-[#d5d5d5] gap-2 items-center mt-2">
        <div className="h-10 w-10 flex items-center justify-center font-bold text-white text-[18px] rounded-[6px] bg-gradient-to-b from-[#403294] to-[#0747a6]">
          T
        </div>
        <p className="text-[14px] font-semibold text-white">
          Taskly Không gian làm việc
        </p>
      </div>

      <div className="flex mt-4 flex-col">
        <div className="flex flex-col">
          <p className="text-white/60 text-sm px-4 mb-2">
            Đang xem Không gian làm việc
          </p>

          <Link href="/boards" className="w-full">
            <div
              className={`flex cursor-pointer px-4 py-2 ${
                pathname === "/boards"
                  ? "bg-white/30"
                  : "hover:bg-white hover:bg-opacity-20"
              } gap-[10px] items-center`}
            >
              <BoardIcon />
              <p className="font-semibold text-white text-[14px]">Bảng</p>
            </div>
          </Link>

          <div className="flex cursor-pointer px-4 py-2 hover:bg-white hover:bg-opacity-20 gap-[10px] items-center">
            <MemberIcon />
            <p className="font-semibold text-white text-[14px]">Thành viên</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="px-4 flex justify-between items-center">
            <p className="text-white/60 text-sm">Các bảng của bạn</p>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>

          <div className="mt-2">
            {boards.map((board) => (
              <Link href={`/board/${board.id}`} key={board.id}>
                <div className={getLinkStyle(board.id)}>
                  <div
                    className={`w-8 h-8 rounded ${board.background || ""}`}
                    style={
                      board.backgroundImage
                        ? {
                            backgroundImage: board.backgroundImage,
                            backgroundSize: "cover",
                          }
                        : {}
                    }
                  ></div>
                  <p className="font-semibold text-white text-[14px]">
                    {board.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
