export type UserRole = 'ADMIN' | 'TRADER';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
}
