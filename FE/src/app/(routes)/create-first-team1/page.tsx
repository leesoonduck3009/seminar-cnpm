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
              Các thẻ là khối xây dựng của bạn
            </h1>
            <p className="text-[14px] font-medium text-[#B6c2cf] mt-6 ">
              Đối với những việc bạn cần làm, sắp xếp hoặc chia sẻ với đồng đội.
            </p>
            <p className="text-[14px] font-medium text-[#B6c2cf] mt-6 ">
              Bạn cũng có thể đặt ngày đến hạn cho thẻ để không bao giờ bỏ lỡ
              điều gì.
            </p>
            <p className="text-[14px] font-medium text-[#B6c2cf] mt-6 ">
              Thêm tiêu đề cho một số thẻ trong danh sách Cần làm của bạn
            </p>
            <p className="text-[12px] font-semibold text-[#B6c2cf] mb-[5px] mt-5 ">
              Tên thẻ 1
            </p>
            <Input
              className="border mb-5 border-[#B6c2cf]"
              placeholder="Ví dụ: Lập kế hoạch dự án"
            />
            <p className="text-[12px] font-semibold text-[#B6c2cf] mb-[5px] mt-5 ">
              Tên thẻ 2
            </p>
            <Input
              className="border border-[#B6c2cf]"
              placeholder="Ví dụ: Họp khởi động"
            />

            <Button className="bg-[#579DFF] mt-5 font-semibold">Sau</Button>
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
