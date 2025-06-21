export interface User {
  id: string;
  name: string;
  email: string;
}

export type AuthMode = "login" | "signup";