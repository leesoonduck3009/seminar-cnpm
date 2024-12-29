import { User } from '@/types/user';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'link';
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: User;
}

export interface Activity {
  id: string;
  type: 'comment' | 'update' | 'move' | 'archive' | 'restore';
  content: string;
  createdAt: string;
  author?: User;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels: Label[];
  attachments: Attachment[];
  comments: Comment[];
  activities: Activity[];
  members: User[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
