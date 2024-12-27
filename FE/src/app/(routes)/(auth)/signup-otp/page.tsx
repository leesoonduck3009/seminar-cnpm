"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OptCheckRequest } from "@/models/auths/auth";
import { RegisterUserCheckOtp } from "@/services/authService";
import * as React from "react";

const Page = () => {
  const [value, setValue] = React.useState("");

  const [countdown, setCountdown] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsResending(false);
    }
  }, [countdown]);

  const handleResendOTP = () => {
    // Thêm logic gửi lại OTP ở đây
    setCountdown(60);
    setIsResending(true);
  };


  const handleOtpCheckClick = async () => {
    const email = localStorage.getItem("email");
    const request: OptCheckRequest = new OptCheckRequest(email!, value);
    const response = await RegisterUserCheckOtp(request);
    console.log(response);
    if (response.isSuccess) {
      window.location.href = "/signup-pass";
    } else {
      alert(response.errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center ">
      <div className="bg-white shadow-md w-[368px] flex-col rounded-[2px] flex items-center justify-center p-8">
        <svg
          width="110"
          height="50"
          viewBox="0 0 186 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M67.48 40V17.4H59.32V12H81.88V17.4H73.48V40H67.48ZM90.1709 40.4C88.4109 40.4 86.8243 39.92 85.4109 38.96C83.9976 38 82.8776 36.6933 82.0509 35.04C81.2243 33.3867 80.8109 31.4933 80.8109 29.36C80.8109 27.2267 81.2243 25.3467 82.0509 23.72C82.9043 22.0667 84.0509 20.7733 85.4909 19.84C86.9309 18.88 88.5709 18.4 90.4109 18.4C91.4509 18.4 92.3976 18.56 93.2509 18.88C94.1309 19.1733 94.8909 19.5867 95.5309 20.12C96.1976 20.6533 96.7576 21.2667 97.2109 21.96C97.6643 22.6533 97.9843 23.4 98.1709 24.2L96.9709 24V18.84H102.611V40H96.8909V34.92L98.1709 34.8C97.9576 35.5467 97.6109 36.2533 97.1309 36.92C96.6509 37.5867 96.0509 38.1867 95.3309 38.72C94.6376 39.2267 93.8509 39.64 92.9709 39.96C92.0909 40.2533 91.1576 40.4 90.1709 40.4ZM91.7309 35.48C92.7976 35.48 93.7309 35.2267 94.5309 34.72C95.3309 34.2133 95.9443 33.5067 96.3709 32.6C96.8243 31.6667 97.0509 30.5867 97.0509 29.36C97.0509 28.16 96.8243 27.1067 96.3709 26.2C95.9443 25.2933 95.3309 24.5867 94.5309 24.08C93.7309 23.5467 92.7976 23.28 91.7309 23.28C90.6909 23.28 89.7709 23.5467 88.9709 24.08C88.1976 24.5867 87.5843 25.2933 87.1309 26.2C86.6776 27.1067 86.4509 28.16 86.4509 29.36C86.4509 30.5867 86.6776 31.6667 87.1309 32.6C87.5843 33.5067 88.1976 34.2133 88.9709 34.72C89.7709 35.2267 90.6909 35.48 91.7309 35.48ZM115.626 40.4C113.652 40.4 111.892 40.08 110.346 39.44C108.826 38.7733 107.599 37.8667 106.666 36.72L110.186 33.68C111.012 34.56 111.932 35.2 112.946 35.6C113.959 35.9733 114.972 36.16 115.986 36.16C116.386 36.16 116.746 36.12 117.066 36.04C117.412 35.9333 117.706 35.8 117.946 35.64C118.186 35.4533 118.359 35.24 118.466 35C118.599 34.7333 118.666 34.4533 118.666 34.16C118.666 33.5733 118.426 33.1067 117.946 32.76C117.679 32.6267 117.266 32.4667 116.706 32.28C116.146 32.0667 115.426 31.84 114.546 31.6C113.186 31.2533 112.026 30.8533 111.066 30.4C110.132 29.92 109.386 29.3867 108.826 28.8C108.346 28.24 107.972 27.64 107.706 27C107.466 26.3333 107.346 25.6 107.346 24.8C107.346 23.84 107.559 22.9733 107.986 22.2C108.412 21.4 108.999 20.72 109.746 20.16C110.519 19.6 111.399 19.1733 112.386 18.88C113.372 18.56 114.412 18.4 115.506 18.4C116.599 18.4 117.666 18.5333 118.706 18.8C119.746 19.0667 120.706 19.4533 121.586 19.96C122.492 20.44 123.279 21.0133 123.946 21.68L120.906 25.04C120.426 24.5867 119.879 24.1733 119.266 23.8C118.679 23.4267 118.066 23.1333 117.426 22.92C116.786 22.7067 116.212 22.6 115.706 22.6C115.252 22.6 114.839 22.64 114.466 22.72C114.119 22.8 113.826 22.92 113.586 23.08C113.346 23.24 113.159 23.4533 113.026 23.72C112.919 23.96 112.866 24.2267 112.866 24.52C112.866 24.8133 112.932 25.0933 113.066 25.36C113.226 25.6267 113.439 25.8533 113.706 26.04C113.999 26.2 114.426 26.3867 114.986 26.6C115.572 26.8133 116.359 27.0533 117.346 27.32C118.626 27.6667 119.706 28.0533 120.586 28.48C121.492 28.9067 122.212 29.4 122.746 29.96C123.199 30.44 123.532 30.9867 123.746 31.6C123.959 32.2133 124.066 32.8933 124.066 33.64C124.066 34.9467 123.692 36.12 122.946 37.16C122.226 38.1733 121.226 38.9733 119.946 39.56C118.666 40.12 117.226 40.4 115.626 40.4ZM133.715 33.64L132.035 28.96L142.035 18.84H149.515L133.715 33.64ZM128.315 40V10.4H133.995V40H128.315ZM142.635 40L135.035 30.44L139.035 27.24L149.475 40H142.635ZM152.657 40V10.4H158.337V40H152.657ZM166.675 49.2L171.315 38.32L171.395 41.6L161.075 18.84H167.515L172.675 31.04C172.888 31.4933 173.088 32.0267 173.275 32.64C173.488 33.2267 173.662 33.8 173.795 34.36L172.835 34.76C172.995 34.3067 173.182 33.7867 173.395 33.2C173.608 32.6133 173.822 31.9867 174.035 31.32L178.475 18.84H184.955L176.075 40L172.435 49.2H166.675Z"
            fill="black"
          />
          <circle cx="25" cy="25" r="25" fill="#2F56DE" />
          <path
            d="M17.5 25.866C16.8333 25.4811 16.8333 24.5189 17.5 24.134L28 18.0718C28.6667 17.6869 29.5 18.168 29.5 18.9378V31.0622C29.5 31.832 28.6667 32.3131 28 31.9282L17.5 25.866Z"
            fill="white"
          />
        </svg>
        <h1 className="mt-5 mb-3 text-[16px] font-semibold text-[#172b4d]">
          Vui lòng nhập mã OTP
        </h1>
        <div className="space-y-2">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="text-center text-[12px]">
            {value === "" ? (
              <>Vui lòng nhập mã OTP</>
            ) : (
              <>You entered: {value}</>
            )}
          </div>
        </div>


        <a href="/signup-pass" className="w-full">
          <Button className="bg-[#0052CC] mt-4 mb-2 w-full font-semibold">
            Tiếp tục
          </Button>
        </a>

        <button
          onClick={handleResendOTP}
          disabled={isResending}
          className={`text-sm ${
            isResending
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          {isResending ? `Gửi lại OTP (${countdown}s)` : "Gửi lại OTP"}
        </button>

        <Button
          className="bg-[#0052CC]  mt-4 mb-5 w-full font-semibold"
          onClick={handleOtpCheckClick}
        >
          Tiếp tục
        </Button>

      </div>
    </div>
  );
};

export default Page;
