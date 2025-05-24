export interface User {
  id: number;
  name: string;
  email: string;
}

export const users: User[] = [
  { id: 1, name: "John Doe", email: "john@deer.com" },
  { id: 2, name: "Jane Smith", email: "jane@deer.com" },
  { id: 3, name: "Bob Johnson", email: "bob@auth.com" },
  { id: 4, name: "Alice Brown", email: "alice@auth.com" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com" },
];
