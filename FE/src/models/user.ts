export class User {
  displayName: string;
  fullName: string;
  email: string;
  gender: GenderType;
  avatarUrl: string;
  createAt: Date;
  constructor(
    displayName: string,
    fullName: string,
    email: string,
    gender: GenderType,
    avatarUrl: string
  ) {
    this.displayName = displayName;
    this.fullName = fullName;
    this.email = email;
    this.gender = gender;
    this.createAt = new Date();
    this.avatarUrl = avatarUrl;
  }
  toJson() {
    return {
      displayName: this.displayName,
      fullName: this.fullName,
      email: this.email,
      gender: this.gender,
      createAt: this.createAt,
      avatarUrl: this.avatarUrl,
    };
  }
  static fromJson(data: any): User {
    const user = new User(
      data.displayName,
      data.fullName,
      data.email,
      data.gender,
      data.avatarUrl
    );

    // Nếu createAt là chuỗi ISO, chuyển thành đối tượng Date
    user.createAt =
      data.createAt instanceof Date ? data.createAt : new Date(data.createAt);

    return user;
  }
}
export enum GenderType {
  Male,
  Female,
}
