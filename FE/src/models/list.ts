export class List {
  id: string;
  name: string;
  position: number; // Vị trí sắp xếp trong bảng
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    position: number,
    createdAt: Date = new Date(), // Mặc định là thời gian hiện tại
    updatedAt: Date = new Date() // Mặc định là thời gian hiện tại
  ) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  // Chuyển instance thành JSON object
  toJson(): object {
    return {
      name: this.name,
      position: this.position,
      createdAt: this.createdAt.toISOString(), // Chuyển thành chuỗi ISO
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  // Static method để tạo instance ToDoList từ plain object
  static fromJson(listId: string, data: any): List {
    return new List(
      listId,
      data.name,
      data.position,
      data.createdAt instanceof Date
        ? data.createdAt
        : new Date(data.createdAt), // Chuyển thành Date nếu là chuỗi
      data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt) // Chuyển thành Date nếu là chuỗi
    );
  }
}
export class PositionChangeRequest {
  position: number;
  listId: string;
  constructor(postion: number, listId: string) {
    this.position = postion;
    this.listId = listId;
  }
}
