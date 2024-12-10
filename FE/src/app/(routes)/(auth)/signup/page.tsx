"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RegisterUserCheckOtp,
  RegisterUserSendOtp,
} from "@/services/authService";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
const SignUpPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/boards");
    }
  }, [currentUser, router]);
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (!isValidEmail(email)) {
      setEmailError(true);
      setErrorMessage("Vui lòng nhập địa chỉ email hợp lệ.");
    } else {
      setEmailError(false);
      setErrorMessage("");
    }
  };
  const signUpHandler = async () => {
    // Call API to sign up
    if (emailError) return;
    await RegisterUserSendOtp(email);
    router.push("/signup-otp");
  };
  function isValidEmail(email: string) {
    return email.includes("@");
  }
  return loading ? (
    <div></div>
  ) : (
    <div className="min-h-screen bg-white flex items-center justify-center ">
      <div className="bg-white shadow-md w-[368px] flex-col rounded-[2px] flex items-center justify-center  p-8">
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
          Đăng ký để tiếp tục
        </h1>
        <Input
          className={`border mb-3 border-[#B6c2cf] ${
            emailError ? "border-red-500" : ""
          }`}
          placeholder="Nhập email của bạn"
          value={email}
          onChange={handleEmailChange}
        />
        {emailError && (
          <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
        )}
        <p className="text-[12px]">
          Bằng việc đăng ký, tôi chấp nhận Điều khoản dịch vụ của Atlassian
          Cloud và công nhận Chính sách quyền riêng tư.
        </p>

        <Button
          className="bg-[#0052CC]  mt-4 mb-5 w-full font-semibold"
          onClick={signUpHandler}
        >
          Đăng ký
        </Button>
        <p className="font-semibold text-[13px] text-[#626262]">
          Hoặc tiếp tục với
        </p>
        <Button className="bg-white shadow-none mt-3 border border-[#B6c2cf] w-full font-semibold">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_383_59)">
                <path
                  d="M5.57338 0.52637C3.97473 1.08096 2.59606 2.13358 1.63987 3.52962C0.683675 4.92567 0.200366 6.59155 0.26093 8.28258C0.321493 9.9736 0.922737 11.6006 1.97635 12.9247C3.02996 14.2488 4.4804 15.2001 6.11463 15.6389C7.43953 15.9807 8.82764 15.9958 10.1596 15.6826C11.3663 15.4116 12.4819 14.8318 13.3971 14.0001C14.3497 13.1081 15.0412 11.9732 15.3971 10.7176C15.784 9.35221 15.8529 7.91629 15.5984 6.52012H8.15838V9.60637H12.4671C12.381 10.0986 12.1965 10.5684 11.9246 10.9877C11.6527 11.4069 11.2989 11.767 10.8846 12.0464C10.3585 12.3944 9.76537 12.6286 9.14338 12.7339C8.51956 12.8499 7.8797 12.8499 7.25588 12.7339C6.62361 12.6031 6.0255 12.3422 5.49963 11.9676C4.65481 11.3696 4.02047 10.52 3.68713 9.54012C3.34815 8.54186 3.34815 7.45963 3.68713 6.46137C3.92441 5.76164 4.31667 5.12454 4.83463 4.59762C5.42737 3.98355 6.17779 3.54462 7.00357 3.32896C7.82935 3.11331 8.69858 3.12928 9.51588 3.37512C10.1543 3.57111 10.7382 3.91354 11.2209 4.37512C11.7067 3.89179 12.1917 3.4072 12.6759 2.92137C12.9259 2.66012 13.1984 2.41137 13.4446 2.14387C12.7078 1.45822 11.843 0.924691 10.8996 0.57387C9.18176 -0.049893 7.3021 -0.066656 5.57338 0.52637Z"
                  fill="white"
                />
                <path
                  d="M5.57348 0.526245C7.30206 -0.067184 9.18171 -0.0508623 10.8997 0.572495C11.8432 0.925699 12.7077 1.46179 13.4435 2.14999C13.1935 2.41749 12.9297 2.66749 12.6747 2.92749C12.1897 3.41166 11.7051 3.89416 11.221 4.37499C10.7383 3.91342 10.1544 3.57098 9.51598 3.37499C8.69895 3.1283 7.82975 3.1114 7.00375 3.32617C6.17775 3.54094 5.42687 3.97907 4.83348 4.59249C4.31552 5.11941 3.92326 5.75652 3.68598 6.45624L1.09473 4.44999C2.02224 2.6107 3.62816 1.20377 5.57348 0.526245Z"
                  fill="#E33629"
                />
                <path
                  d="M0.407926 6.43745C0.547203 5.74719 0.778431 5.07873 1.09543 4.44995L3.68668 6.4612C3.34769 7.45946 3.34769 8.54169 3.68668 9.53995C2.82334 10.2066 1.95959 10.8766 1.09543 11.55C0.301864 9.97035 0.0598419 8.17058 0.407926 6.43745Z"
                  fill="#F8BD00"
                />
                <path
                  d="M8.15876 6.5188H15.5988C15.8533 7.91496 15.7844 9.35088 15.3975 10.7163C15.0416 11.9719 14.3501 13.1067 13.3975 13.9988C12.5613 13.3463 11.7213 12.6988 10.885 12.0463C11.2996 11.7666 11.6535 11.4062 11.9254 10.9865C12.1973 10.5668 12.3817 10.0965 12.4675 9.6038H8.15876C8.15751 8.5763 8.15876 7.54755 8.15876 6.5188Z"
                  fill="#587DBD"
                />
                <path
                  d="M1.09375 11.55C1.95792 10.8834 2.82167 10.2134 3.685 9.54004C4.01901 10.5203 4.65426 11.3699 5.5 11.9675C6.02751 12.3404 6.62691 12.5992 7.26 12.7275C7.88382 12.8435 8.52368 12.8435 9.1475 12.7275C9.76949 12.6223 10.3626 12.3881 10.8888 12.04C11.725 12.6925 12.565 13.34 13.4012 13.9925C12.4861 14.8247 11.3705 15.4049 10.1637 15.6763C8.83176 15.9894 7.44365 15.9744 6.11875 15.6325C5.07088 15.3528 4.09209 14.8595 3.24375 14.1838C2.34583 13.4709 1.61244 12.5725 1.09375 11.55Z"
                  fill="#319F43"
                />
              </g>
              <defs>
                <clipPath id="clip0_383_59">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p className="font-semibold text-black text-[12px]">Google</p>
          </div>
        </Button>
        <div className="flex mt-5 items-center gap-2">
          <a href="/login">
            <p className="text-[12px] hover:underline cursor-pointer text-[#0052CC]">
              Bạn đã có tài khoản Taskly? Đăng nhập ngay
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
