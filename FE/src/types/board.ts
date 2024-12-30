import { Label } from '@/types/card';
import { Column } from '@/types/column';
import { BoardMember } from '@/types/user';

export interface Board {
  id: number;
  title: string;
  description?: string;
  background?: string;
  backgroundImage?: string;
  visibility: 'private' | 'workspace' | 'public';
  starred: boolean;
  members: BoardMember[];
  columns: Column[];
  labels: Label[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
