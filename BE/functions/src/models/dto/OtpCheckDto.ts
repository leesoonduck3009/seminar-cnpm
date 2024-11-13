export class OptCheckRequest {
  email: string;
  OtpCode: string;
  constructor(email: string, OtpCode: string) {
    this.email = email;
    this.OtpCode = OtpCode;
  }
}
export class OptCheckResponse {
  uid: string;
  token: string;
  constructor(uid: string, token: string) {
    this.uid = uid;
    this.token = token;
  }
}
