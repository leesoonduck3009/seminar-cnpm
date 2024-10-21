import { UserRecord } from "firebase-admin/auth";
//import { User } from "../../user";

export class UserLoginResponseDto {
  user: UserRecord;
  accessToken: string;
  constructor(user: UserRecord, accessToken: string) {
    this.user = user;
    this.accessToken = accessToken;
  }
}
