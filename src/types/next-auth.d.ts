import { type DefaultSession } from "next-auth";

// Extend NextAuth session types with custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

// Extend JWT token type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
