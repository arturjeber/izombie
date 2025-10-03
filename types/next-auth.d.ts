// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
			tokenVersion?: number;
    };
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
  }

  interface JWT {
    userId: string;
    tokenVersion?: number;
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
  }
}


