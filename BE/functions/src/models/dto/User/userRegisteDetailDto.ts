export class UserRegisterDetail {
  uid: string;
  displayName: string;
  password: string;
  constructor(displayName: string, uid: string, password: string) {
    this.displayName = displayName;
    this.uid = uid;
    this.password = password;
  }
  toJson(): any {
    return {
      displayName: this.displayName,
      password: this.password,
    };
  }
}
