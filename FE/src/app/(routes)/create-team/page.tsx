import Header from "@/components/header/header";
import LogoIcon from "@/components/icons/LogoIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="grid grid-cols-5 h-screen">
        <div className="col-span-2 bg-[#1D2125] justify-center items-center flex">
          <div className="w-[300px]">
            <h1 className="text-[34px] text-[#B6c2cf] font-semibold">
              Tất cả bắt đầu với bảng
            </h1>
            <p className="text-[14px] font-medium text-[#B6c2cf] mt-6 ">
              Bảng là nơi thực hiện công việc trong Trello. Bạn sẽ tìm thấy thẻ,
              danh sách, ngày hết hạn, và hơn thế nữa để giúp bạn luôn ngăn nắp
              và đi đúng hướng.
            </p>
            <p className="text-[12px] font-semibold text-[#B6c2cf] mb-[5px] mt-5 ">
              Nhập tên bảng
            </p>
            <Input
              className="border border-[#B6c2cf]"
              placeholder="Ví dụ: Bảng của tôi"
            />
            <a href="/create-first-team">
              <Button className="bg-[#579DFF] mt-5 font-semibold">Sau</Button>
            </a>
          </div>
        </div>
        <div className="col-span-3 flex justify-center items-center bg-[#1D2632]">
          <img
            src="assets/images/img_banner_create.png"
            alt="Mô tả ảnh"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
