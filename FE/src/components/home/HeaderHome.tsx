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

const HeaderHome = () => {
  return (
    <div className="h-[48px] justify-between flex items-center p-2 bg-[#821659]">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <svg
          width="98"
          height="28"
          viewBox="0 0 98 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11.5" cy="14" r="11.5" fill="white" />
          <path
            d="M31.28 22V9.9H26.704V6.6H39.706V9.9H35.02V22H31.28ZM44.2086 22.198C43.2259 22.198 42.3459 21.9413 41.5686 21.428C40.8059 20.9 40.1973 20.1813 39.7426 19.272C39.2879 18.348 39.0606 17.3067 39.0606 16.148C39.0606 14.96 39.2879 13.9113 39.7426 13.002C40.1973 12.0927 40.8206 11.3813 41.6126 10.868C42.4046 10.34 43.3066 10.076 44.3186 10.076C44.8759 10.076 45.3819 10.1567 45.8366 10.318C46.3059 10.4793 46.7166 10.7067 47.0686 11C47.4206 11.2787 47.7213 11.6087 47.9706 11.99C48.2199 12.3567 48.4033 12.7527 48.5206 13.178L47.7946 13.09V10.318H51.2926V22H47.7286V19.184L48.5206 19.162C48.4033 19.5727 48.2126 19.9613 47.9486 20.328C47.6846 20.6947 47.3619 21.0173 46.9806 21.296C46.5993 21.5747 46.1739 21.7947 45.7046 21.956C45.2353 22.1173 44.7366 22.198 44.2086 22.198ZM45.1766 19.228C45.7193 19.228 46.1886 19.1033 46.5846 18.854C46.9806 18.6047 47.2886 18.2527 47.5086 17.798C47.7286 17.3287 47.8386 16.7787 47.8386 16.148C47.8386 15.5173 47.7286 14.9747 47.5086 14.52C47.2886 14.0507 46.9806 13.6913 46.5846 13.442C46.1886 13.178 45.7193 13.046 45.1766 13.046C44.6486 13.046 44.1866 13.178 43.7906 13.442C43.4093 13.6913 43.1086 14.0507 42.8886 14.52C42.6686 14.9747 42.5586 15.5173 42.5586 16.148C42.5586 16.7787 42.6686 17.3287 42.8886 17.798C43.1086 18.2527 43.4093 18.6047 43.7906 18.854C44.1866 19.1033 44.6486 19.228 45.1766 19.228ZM58.4466 22.22C57.3026 22.22 56.2906 22.0367 55.4106 21.67C54.5452 21.3033 53.8559 20.812 53.3426 20.196L55.4766 18.348C55.9312 18.8027 56.4446 19.14 57.0166 19.36C57.5886 19.5653 58.1312 19.668 58.6446 19.668C58.8499 19.668 59.0332 19.646 59.1946 19.602C59.3559 19.558 59.4879 19.4993 59.5906 19.426C59.7079 19.338 59.7959 19.2427 59.8546 19.14C59.9132 19.0227 59.9426 18.8907 59.9426 18.744C59.9426 18.4507 59.8106 18.2233 59.5466 18.062C59.4146 17.9887 59.1946 17.9007 58.8866 17.798C58.5786 17.6953 58.1826 17.578 57.6986 17.446C57.0092 17.27 56.4079 17.0647 55.8946 16.83C55.3959 16.5807 54.9852 16.2947 54.6626 15.972C54.3692 15.664 54.1419 15.3267 53.9806 14.96C53.8192 14.5787 53.7386 14.1533 53.7386 13.684C53.7386 13.1413 53.8632 12.65 54.1126 12.21C54.3766 11.77 54.7212 11.3887 55.1466 11.066C55.5866 10.7433 56.0852 10.5013 56.6426 10.34C57.2146 10.164 57.8012 10.076 58.4026 10.076C59.0479 10.076 59.6639 10.1493 60.2506 10.296C60.8372 10.4427 61.3799 10.648 61.8786 10.912C62.3919 11.176 62.8466 11.4913 63.2426 11.858L61.3946 13.926C61.1306 13.6767 60.8299 13.4567 60.4926 13.266C60.1699 13.0607 59.8326 12.8993 59.4806 12.782C59.1286 12.6647 58.8059 12.606 58.5126 12.606C58.2926 12.606 58.0946 12.628 57.9186 12.672C57.7572 12.7013 57.6179 12.76 57.5006 12.848C57.3832 12.9213 57.2952 13.0167 57.2366 13.134C57.1779 13.2367 57.1486 13.3613 57.1486 13.508C57.1486 13.6547 57.1852 13.794 57.2586 13.926C57.3466 14.058 57.4639 14.168 57.6106 14.256C57.7572 14.344 57.9919 14.4467 58.3146 14.564C58.6372 14.6667 59.0772 14.7987 59.6346 14.96C60.3239 15.1507 60.9179 15.3633 61.4166 15.598C61.9152 15.8327 62.3112 16.1113 62.6046 16.434C62.8392 16.6833 63.0152 16.9767 63.1326 17.314C63.2499 17.6367 63.3086 17.9887 63.3086 18.37C63.3086 19.118 63.0959 19.7853 62.6706 20.372C62.2599 20.944 61.6879 21.3987 60.9546 21.736C60.2212 22.0587 59.3852 22.22 58.4466 22.22ZM68.8991 18.568L67.6011 15.928L73.0571 10.318H77.6991L68.8991 18.568ZM65.5111 22V5.72H69.0311V22H65.5111ZM73.4311 22L69.3171 16.676L71.8031 14.74L77.5891 22H73.4311ZM79.3072 22V5.72H82.8272V22H79.3072ZM87.2286 27.06L89.8906 20.79L89.9346 22.594L84.3026 10.318H88.2846L90.7486 16.192C90.8806 16.4853 91.0052 16.8007 91.1226 17.138C91.2399 17.4753 91.3279 17.798 91.3866 18.106L90.9026 18.392C90.9906 18.172 91.0859 17.9007 91.1886 17.578C91.3059 17.2407 91.4306 16.8813 91.5626 16.5L93.7186 10.318H97.7226L92.7506 22L90.7266 27.06H87.2286Z"
            fill="white"
          />
          <path
            d="M7.70772 14.3874C6.98916 14.014 6.98916 12.986 7.70772 12.6126L12.0389 10.3621C12.7046 10.0162 13.5 10.4992 13.5 11.2494V15.7506C13.5 16.5008 12.7046 16.9838 12.0389 16.6379L7.70772 14.3874Z"
            fill="#821659"
          />
        </svg>
        {/* Không gian làm việc */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex py-[6px] hover:bg-white hover:bg-opacity-20 rounded-[5px] cursor-pointer px-3 items-center gap-[6px]">
              <p className="font-semibold text-[14px] text-white ">
                Các Không gian làm việc
              </p>
              <DropdownIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[304px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <p className="text-[12px] font-semibold text-[#44546f]">
                    Không gian làm việc hiện tại
                  </p>
                  <div className="flex gap-2 items-center mt-2">
                    <div className="h-10 w-10 flex items-center justify-center font-bold text-white text-[18px] rounded-[6px] bg-gradient-to-b from-[#403294] to-[#0747a6]">
                      T
                    </div>
                    <p className="text-[14px] font-semibold text-[#172d4b] ">
                      Taskly Không gian làm việc
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <p className="text-[12px] font-semibold text-[#44546f]">
                    Các không gian làm việc của bạn
                  </p>
                  <div className="flex gap-2 items-center mt-2">
                    <div className="h-10 w-10 flex items-center justify-center font-bold text-white text-[18px] rounded-[6px] bg-gradient-to-b from-[#403294] to-[#0747a6]">
                      T
                    </div>
                    <p className="text-[14px] font-semibold text-[#172d4b] ">
                      Taskly Không gian làm việc
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Thêm
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex py-[6px] hover:bg-white hover:bg-opacity-20 rounded-[5px] cursor-pointer px-3 items-center gap-[6px]">
              <p className="font-semibold text-[14px] text-white ">Thêm</p>
              <DropdownIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[304px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex w-full items-center justify-between">
                  <p className="text-[14px] text-[#172b4d]">Bảng Gần Đây</p>
                  <DropRightIcon />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex w-full items-center justify-between">
                  <p className="text-[14px] text-[#172b4d]">
                    Bảng Đánh Dấu Sao
                  </p>
                  <DropRightIcon />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex w-full items-center justify-between">
                  <p className="text-[14px] text-[#172b4d]">Mẫu</p>
                  <DropRightIcon />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}
        {/* Gần đây */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex py-[6px] hover:bg-white hover:bg-opacity-20 rounded-[5px] cursor-pointer px-3 items-center gap-[6px]">
              <p className="font-semibold text-[14px] text-white ">Gần đây</p>
              <DropdownIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[304px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex gap-2 items-center mt-2">
                  <div className="h-9 w-10 flex items-center justify-center font-bold text-white text-[18px] rounded-[3px] bg-gradient-to-br from-pink-400 via-red-300 to-orange-300 "></div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semibold text-[#172b4d] ">
                      Bảng Taskly của tôi
                    </p>
                    <p className="text-[12px] text-[#626f86] ">
                      Taskly không gian làm việc
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Đánh dấu sao */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex py-[6px] hover:bg-white hover:bg-opacity-20 rounded-[5px] cursor-pointer px-3 items-center gap-[6px]">
              <p className="font-semibold text-[14px] text-white ">
                Đánh dấu sao
              </p>
              <DropdownIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[304px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex gap-2 items-center mt-2">
                  <div className="h-9 w-10 flex items-center justify-center font-bold text-white text-[18px] rounded-[3px] bg-gradient-to-br from-pink-400 via-red-300 to-orange-300 "></div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semibold text-[#172b4d] ">
                      Bảng Taskly của tôi
                    </p>
                    <p className="text-[12px] text-[#626f86] ">
                      Taskly không gian làm việc
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Mẫu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex py-[6px] hover:bg-white hover:bg-opacity-20 rounded-[5px] cursor-pointer px-3 items-center gap-[6px]">
              <p className="font-semibold text-[14px] text-white ">Mẫu</p>
              <DropdownIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[304px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex gap-2 items-center mt-2">
                  <div className="h-9 w-10 flex items-center justify-center font-bold text-white text-[18px] rounded-[3px] bg-gradient-to-br from-pink-400 via-red-300 to-orange-300 "></div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semibold text-[#172b4d] ">
                      Bảng Taskly của tôi
                    </p>
                    <p className="text-[12px] text-[#626f86] ">
                      Taskly không gian làm việc
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Tạo mới */}
        <Button className="rounded-[5px] font-semibold text-[14px] text-white  bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-40">
          Tạo mới
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Input
          className="placeholder:text-[14px] w-[200px] placeholder:text-white "
          placeholder="Tìm kiếm"
        />
        <Button className="rounded-full font-semibold text-[14px] text-white   h-9 px-0 shadow-none py-0 w-9 bg-transparent hover:bg-white hover:bg-opacity-20">
          <BellIcon />
        </Button>
        <Button className=" gap-0 rounded-full font-semibold text-[14px] text-white   h-9 p-0 shadow-none w-9 bg-transparent hover:bg-white hover:bg-opacity-20">
          <HelpCenterIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className=" gap-0 rounded-full font-semibold text-[14px] text-white   h-9 p-0 shadow-none w-9 bg-transparent hover:bg-white hover:bg-opacity-20">
              <div className="h-6 w-6 items-center justify-center rounded-full">
                <img
                  src="/assets/images/chloe-cat.jpg"
                  alt="Placeholder"
                  className="h-full w-full object-cover"
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[304px]">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex w-full items-center justify-between">
                  <p className="text-[14px] text-[#172b4d]">Bảng Gần Đây</p>
                  <DropRightIcon />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex w-full items-center justify-between">
                  <p className="text-[14px] text-[#172b4d]">
                    Bảng Đánh Dấu Sao
                  </p>
                  <DropRightIcon />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex w-full items-center justify-between">
                  <p className="text-[14px] text-[#172b4d]">Mẫu</p>
                  <DropRightIcon />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HeaderHome;
