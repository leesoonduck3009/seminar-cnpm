export class UserRegisterResponseDto {
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
