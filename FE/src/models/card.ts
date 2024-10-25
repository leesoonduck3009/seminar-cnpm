export class Card {
  id: string;
  title: string;
  description: string;
  assignedTo: string[]; // Danh sách người được giao (uid)
  labels: string[];
  dueDate: Date;
  position: number; // Vị trí sắp xếp trong danh sách
  attachments: string[]; // Danh sách ID các tệp đính kèm (attachmentId)
  comments: string[]; // Danh sách ID các bình luận (commentId)
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    assignedTo: string[],
    labels: string[],
    dueDate: Date,
    position: number,
    attachments: string[],
    comments: string[],
    createdAt: Date = new Date(), // Mặc định là thời gian hiện tại
    updatedAt: Date = new Date() // Mặc định là thời gian hiện tại
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.assignedTo = assignedTo;
    this.labels = labels;
    this.dueDate = dueDate;
    this.position = position;
    this.attachments = attachments;
    this.comments = comments;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Chuyển instance thành JSON object
  toJson(): object {
    return {
      title: this.title,
      description: this.description,
      assignedTo: this.assignedTo,
      labels: this.labels,
      dueDate: this.dueDate.toISOString(), // Chuyển thành chuỗi ISO
      position: this.position,
      attachments: this.attachments,
      comments: this.comments,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  // Static method để tạo instance Card từ plain object
  static fromJson(id: string, data: any): Card {
    return new Card(
      id,
      data.title,
      data.description,
      data.assignedTo,
      data.labels,
      data.dueDate instanceof Date ? data.dueDate : new Date(data.dueDate), // Chuyển thành Date nếu là chuỗi
      data.position,
      data.attachments,
      data.comments,
      data.createdAt instanceof Date
        ? data.createdAt
        : new Date(data.createdAt), // Chuyển thành Date nếu là chuỗi
      data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt) // Chuyển thành Date nếu là chuỗi
    );
  }
}
