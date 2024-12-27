export class OptCheckResponse {
  uid: string;
  token: string;
  constructor(uid: string, token: string) {
    this.uid = uid;
    this.token = token;
  }
  static fromJson(json: any): OptCheckResponse {
    return new OptCheckResponse(json.uid, json.token);
  }
}
