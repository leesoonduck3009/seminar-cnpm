import BoardIcon from "@/components/icons/BoardIcon";
import MemberIcon from "@/components/icons/MemberIcon";
import SettingIcon from "@/components/icons/SettingIcon";
import React from "react";

const SideBar = () => {
  return (
    <div className="w-[320px] bg-[#9F246E] border-r border-t border-opacity-20 border-[#d5d5d5] h-screen  flex flex-col">
      <div className="flex  py-3 px-4 border-b border-opacity-20 border-[#d5d5d5] gap-2 items-center mt-2">
        <div className="h-10 w-10 flex items-center justify-center font-bold text-white text-[18px] rounded-[6px] bg-gradient-to-b from-[#403294] to-[#0747a6]">
          T
        </div>
        <p className="text-[14px] font-semibold text-white ">
          Taskly Không gian làm việc
        </p>
      </div>
      <div className=" flex mt-4 flex-col">
        <div className="flex cursor-pointer px-4 py-2 hover:bg-white hover:bg-opacity-20  gap-[10px] items-center">
          <BoardIcon />
          <p className="font-semibold text-white text-[14px]">Bảng</p>
        </div>
        <div className="flex cursor-pointer px-4 py-2 hover:bg-white hover:bg-opacity-20  gap-[10px] items-center">
          <MemberIcon />
          <p className="font-semibold text-white text-[14px]">Thành viên</p>
        </div>
        <div className="flex cursor-pointer px-4 py-2 hover:bg-white hover:bg-opacity-20  gap-[10px] items-center">
          <SettingIcon />
          <p className="font-semibold text-white text-[14px]">
            Các cài đặt không gian làm việc
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
