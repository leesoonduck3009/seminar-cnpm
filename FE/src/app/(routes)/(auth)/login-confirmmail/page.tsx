import EmailComponent from "@/components/ui/email-component";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center ">
      <div className="bg-white shadow-md w-[368px] flex-col rounded-[2px] flex items-center justify-center  p-8">
        <h1 className="mt-5 mb-3 text-[16px] font-semibold text-[#172b4d]">
          Xác nhận email
        </h1>
        <EmailComponent />
        <p className="text-[12px] text-center mt-3">
          Chúng tôi đã gửi mail xác nhận qua email của bạn. Vui lòng kiểm tra
          hộp thư và xác nhận tạo tài khoản
        </p>
      </div>
    </div>
  );
};

export default page;
