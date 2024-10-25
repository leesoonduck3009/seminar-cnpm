export class OptCheckRequest {
  email: string;
  OtpCode: string;
  constructor(email: string, OtpCode: string) {
    this.email = email;
    this.OtpCode = OtpCode;
  }
}
