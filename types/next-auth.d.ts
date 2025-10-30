import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: Date | null;
      tokenVersion?: number;
      playerId?: number | null;
    };
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    error?: 'InvalidSession' | null;
    expires: string;
  }

  interface User extends DefaultUser {
    tokenVersion?: number;
    emailVerified?: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
    tokenVersion?: number;
    playerId?: number | null;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    error?: 'InvalidSession' | null;
  }
}
