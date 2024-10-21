export interface Comment {
    id: string;
    authorId: string; // ID của người viết bình luận (uid)
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
