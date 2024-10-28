export class User {
  id: string; // ID người dùng (có thể là UID từ Firebase Authentication)
  displayName: string;
  email: string;
  avatarURL: string;
  boards: string[];
  createdAt: Date;
  constructor(
    id: string, // ID người dùng (có thể là UID từ Firebase Authentication)
    displayName: string,
    email: string,
    avatarURL: string,
    boards: string[]
  ) {
    this.id = id;
    this.displayName = displayName;
    this.avatarURL = avatarURL;
    this.email = email;
    this.boards = boards;
    this.createdAt = new Date();
  }
  toJson() {
    return {
      displayName: this.displayName,
      avatarURL: this.avatarURL,
      email: this.email,
      createdAt: this.createdAt,
      boards: this.boards,
    };
  }
  static fromJson(data: any): User {
    const user = new User(
      data.id,
      data.displayName,
      data.avatarURL,
      data.email,
      data.boards
    );

    // Nếu createAt là chuỗi ISO, chuyển thành đối tượng Date
    user.createdAt =
      data.createdAt instanceof Date ? data.createAt : new Date(data.createAt);
    return user;
  }
}
export enum GenderType {
  Male,
  Female,
}
