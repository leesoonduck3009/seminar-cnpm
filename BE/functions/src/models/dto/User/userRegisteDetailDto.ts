export class UserRegisterDetail {
  uid: string;
  displayName: string;
  constructor(displayName: string, uid: string) {
    this.displayName = displayName;
    this.uid = uid;
  }
  toJson(): any {
    return {
      displayName: this.displayName,
    };
  }
}
export class UserRegisterPassword {
  uid: string;
  password: string;
  constructor(uid: string, password: string) {
    this.uid = uid;
    this.password = password;
  }
  toJson(): any {
    return {
      password: this.password,
    };
  }
}
