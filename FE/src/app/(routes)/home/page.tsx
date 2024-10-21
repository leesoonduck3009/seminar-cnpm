import React from "react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropdownIcon from "@/components/icons/DropdownIcon";
import DropRightIcon from "@/components/icons/DropRightIcon";
import { Input } from "@/components/ui/input";
import BellIcon from "@/components/icons/BellIcon";
import HelpCenterIcon from "@/components/icons/HelpCenterIcon";
import HeaderHome from "@/components/home/HeaderHome";
import SideBar from "@/components/home/SideBar";
const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeaderHome />
      <div className="flex">
        <SideBar />
        <div className="bg-gradient-to-br w-full h-screen from-[#EC74A0] via-[#F1748B] to-[#F77466]">
          <div className="w-full flex items-center h-[56px] px-3 py-4 bg-black bg-opacity-25">
            <p className="text-[18px] font-black text-white">
              Bảng Taskly của tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
