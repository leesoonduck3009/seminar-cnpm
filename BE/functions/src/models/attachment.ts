export interface Attachment {
  id: string;
  fileName: string;
  fileURL: string;
  uploadedBy: string; // ID người tải lên (uid)
  uploadedAt: Date;
}
