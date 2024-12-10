export class OptCheckRequest {
  email: string;
  OtpCode: string;
  constructor(email: string, OtpCode: string) {
    this.email = email;
    this.OtpCode = OtpCode;
  }
}
export class UserRegisterResponse {
  uid: string;
  email: string;
  displayName: string;
  constructor(email: string, uid: string, displayName: string) {
    this.email = email;
    this.uid = uid;
    this.displayName = displayName;
  }
  toJson(): any {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
    };
  }
}

export class CreateUserRequest {
  displayName: string;
  email: string;
  password: string;
  constructor(displayName: string, email: string, password: string) {
    this.displayName = displayName;
    this.email = email;
    this.password = password;
  }
}
export class LoginUserRequest {
  email: string;
  password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
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