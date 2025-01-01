class UserRegisterDto {
  email: string;
  password: string;
  displayName: string;
  constructor(email: string, password: string, displayName: string) {
    this.displayName = displayName;
    this.password = password;
    this.email = email;
  }
}
