import { Timestamp } from "firebase-admin/firestore";

export class OTPCheck {
  OtpCode: string;
  ExpiredTime: Date;
  CreatedAt: Date;
  Email: string; // Thay thế UserId bằng Email
  Attempts: number;
  IsUsed: boolean;

  constructor(OtpCode: string, Email: string) {
    this.OtpCode = OtpCode;
    this.CreatedAt = new Date(); // Lưu thời gian tạo mã OTP
    this.ExpiredTime = new Date(this.CreatedAt.getTime() + 5 * 60 * 1000);
    this.Email = Email; // Sử dụng email thay vì userId
    this.Attempts = 0; // Ban đầu chưa có lần thử nào
    this.IsUsed = false; // OTP chưa được sử dụng
  }

  // Kiểm tra mã OTP có còn hiệu lực hay không
  isExpired(): boolean {
    debugger;
    return new Date() > this.ExpiredTime;
  }

  // Kiểm tra mã OTP đã được sử dụng chưa
  isAlreadyUsed(): boolean {
    return this.IsUsed;
  }

  // Cập nhật trạng thái sử dụng của mã OTP
  useOTP(): void {
    this.IsUsed = true;
  }

  // Kiểm tra số lần nhập sai có vượt quá giới hạn không
  isMaxAttemptsReached(maxAttempts: number = 3): boolean {
    return this.Attempts >= maxAttempts;
  }

  // Tăng số lần thử nhập sai OTP
  incrementAttempts(): void {
    this.Attempts++;
  }
  toJson() {
    return {
      OtpCode: this.OtpCode,
      ExpiredTime: this.ExpiredTime, // Chuyển Date thành chuỗi ISO
      CreatedAt: this.CreatedAt, // Chuyển Date thành chuỗi ISO
      Email: this.Email,
      Attempts: this.Attempts,
      IsUsed: this.IsUsed,
    };
  }
  static fromJson(data: any): OTPCheck {
    const otpCheck = new OTPCheck(data.OtpCode, data.Email);
    otpCheck.CreatedAt =
      data.CreatedAt instanceof Timestamp
        ? data.CreatedAt.toDate()
        : new Date(data.CreatedAt);
    otpCheck.ExpiredTime =
      data.ExpiredTime instanceof Timestamp
        ? data.ExpiredTime.toDate()
        : new Date(data.ExpiredTime);
    otpCheck.Attempts = data.Attempts;
    otpCheck.IsUsed = data.IsUsed;
    return otpCheck;
  }
}
