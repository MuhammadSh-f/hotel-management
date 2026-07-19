export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "staff";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
