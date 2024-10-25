export class Board {
  id: string; // Tự động tạo ID hoặc UUID
  name: string;
  description: string;
  ownerId: string; // ID người tạo bảng (uid)
  members: string[]; // Danh sách ID người dùng tham gia (uid)
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    ownerId: string,
    members: string[] = [], // Mặc định là mảng rỗng nếu không cung cấp
    createdAt: Date = new Date(), // Mặc định là thời gian hiện tại
    updatedAt: Date = new Date() // Mặc định là thời gian hiện tại
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.members = members;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJson(): object {
    return {
      name: this.name,
      description: this.description,
      ownerId: this.ownerId,
      members: this.members,
      createdAt: this.createdAt.toISOString(), // Đảm bảo chuẩn hóa thời gian thành chuỗi ISO
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  // Static method để tạo instance Board từ plain object
  static fromJson(id: string, data: any): Board {
    return new Board(
      id,
      data.name,
      data.description,
      data.ownerId,
      data.members || [], // Nếu không có `members`, sẽ là mảng rỗng
      data.createdAt instanceof Date
        ? data.createdAt
        : new Date(data.createdAt), // Chuyển đổi thành Date nếu là chuỗi
      data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt) // Chuyển đổi thành Date nếu là chuỗi
    );
  }
}
