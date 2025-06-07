export interface User {
  id: string;
  name: string;
  email: string;
  password: string; 
}
export const users = [
  {
    id: 'u1',
    name: 'Roro',
    email: 'roro@example.com',
    role: 'client', // or 'provider'
  },
  {
    id: 'u2',
    name: 'Jess Wellness',
    email: 'jess@wellness.com',
    role: 'provider',
  },
];
