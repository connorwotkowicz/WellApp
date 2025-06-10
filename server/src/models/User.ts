export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'provider' | 'admin'; 
}

export const users: User[] = [
  {
    id: 'u1',
    name: 'Roro',
    email: 'roro@example.com',
    password: 'hashed-password', 
    role: 'client',
  },
  {
    id: 'u2',
    name: 'Jess Wellness',
    email: 'jess@wellness.com',
    password: 'hashed-password', 
    role: 'provider',
  },
];
