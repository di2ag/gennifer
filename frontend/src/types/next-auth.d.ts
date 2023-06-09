/* eslint-disable no-unused-vars */
import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type AccessToken = string;

declare module 'next-auth/jwt' {
    interface JWT {
        refresh_token: string;
        access_token: string;
        expires_in: number;
        issued_at: number;
        expires_at: number;
        refresh: string;
        access: string;
        exp: number;
        iat?: number;
        jti?: string;
        email: string;
        username: string;
        first_name?: string;
        last_name?: string;
        error?: "RefreshAccessTokenError";
    }
}

declare module 'next-auth'{
    interface Session {
        user: User
        error?: "RefreshAccessTokenError"
    }

    interface User {
        access?: string;
        refresh?: string;
        access_token: string;
        refresh_token: string;
        expires_in: number;
        issued_at: number;
        expires_at: number;
        username: string;
        email?: string;
        first_name?: string;
        last_name?: string;
    }
}