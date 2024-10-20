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
            <h1 className="text-[34px] text-[#B6c2cf] font-semibold">
              Mời nhóm
            </h1>
            <p className="text-[14px] font-medium text-[#B6c2cf] mt-6 ">
              Bạn đã sẵn sàng! Hãy mời đồng đội cộng tác cùng bạn.
            </p>
            <p className="text-[12px] font-semibold text-[#B6c2cf] mb-[5px] mt-5 ">
              Nhập email hoặc tìm kiếm theo tên
            </p>
            <Input
              className="border border-[#B6c2cf]"
              placeholder="Ví dụ: hientran@gmail.com"
            />
            <Button className="bg-[#579DFF] mt-5 font-semibold">
              Một điều cuối cùng
            </Button>
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
