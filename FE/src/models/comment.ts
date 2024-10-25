export class Comment {
  id: string;
  authorId: string; // ID của người viết bình luận (uid)
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    authorId: string,
    content: string,
    createdAt: Date = new Date(), // Mặc định là thời gian hiện tại
    updatedAt: Date = new Date() // Mặc định là thời gian hiện tại
  ) {
    this.id = id;
    this.authorId = authorId;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Chuyển instance thành JSON object
  toJson(): object {
    return {
      authorId: this.authorId,
      content: this.content,
      createdAt: this.createdAt.toISOString(), // Chuyển thành chuỗi ISO
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  // Static method để tạo instance Comment từ plain object
  static fromJson(id: string, data: any): Comment {
    return new Comment(
      id,
      data.authorId,
      data.content,
      data.createdAt instanceof Date
        ? data.createdAt
        : new Date(data.createdAt), // Chuyển thành Date nếu là chuỗi
      data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt) // Chuyển thành Date nếu là chuỗi
    );
  }
}
