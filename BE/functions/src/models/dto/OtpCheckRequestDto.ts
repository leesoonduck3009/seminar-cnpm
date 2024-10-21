export class OptCheckRequest {
  id: string;
  OtpCode: string;
  constructor(id: string, OtpCode: string) {
    this.id = id;
    this.OtpCode = OtpCode;
  }
}
