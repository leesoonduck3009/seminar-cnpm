import Header from "@/components/header/header";
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
            <h1 className="text-[34px] leading-10 text-[#B6c2cf] font-semibold">
              Bây giờ hãy sắp xếp bảng của bạn với các danh sách
            </h1>
            <p className="text-[14px] font-medium text-[#B6c2cf] mt-6 ">
              Danh sách là một nhóm thẻ đại diện cho các mốc quan trọng, các ý
              tưởng hoặc mục tiêu của nhóm. Tùy chỉnh danh sách của bạn và thêm
              bao nhiêu tùy thích.
            </p>
            <p className="text-[14px] font-medium text-[#B6c2cf] mt-6 ">
              Nhiều người bắt đầu với:
            </p>
            <p className="text-[12px] font-semibold text-[#B6c2cf] mb-[5px] mt-5 ">
              Đặt tên danh sách của bạn
            </p>
            <Input
              className="border mb-5 border-[#B6c2cf]"
              placeholder="Ví dụ: Cần làm"
            />
            <Input
              className="border mb-5 border-[#B6c2cf]"
              placeholder="Ví dụ: Đang làm"
            />
            <Input
              className="border border-[#B6c2cf]"
              placeholder="Ví dụ: Đã xong"
            />
            <a href="/create-first-team1">
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
