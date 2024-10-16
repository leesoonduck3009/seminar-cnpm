export interface Board {
    id: string; // Tự động tạo ID hoặc UUID
    name: string;
    description: string;
    ownerId: string; // ID người tạo bảng (uid)
    members: string[]; // Danh sách ID người dùng tham gia (uid)
    createdAt: Date;
    updatedAt: Date;
}