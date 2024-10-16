export class User {
  id: string; // ID người dùng (có thể là UID từ Firebase Authentication)
  displayName: string;
  email: string;
  avatarURL: string;
  boards: string[];
  createdAt: Date;
  updatedAt: Date;
  constructor(
    id: string,
    displayName: string,
    email: string,
    avatarURL: string,
    boards: string[],
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.displayName = displayName;
    this.email = email;
    this.avatarURL = avatarURL;
    this.boards = boards;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
