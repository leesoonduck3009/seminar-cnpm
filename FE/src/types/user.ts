export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface BoardMember extends User {
  role: 'admin' | 'normal';
  joinedAt: string;
}
