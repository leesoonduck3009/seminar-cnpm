export interface Card {
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
}
