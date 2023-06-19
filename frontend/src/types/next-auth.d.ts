/* eslint-disable no-unused-vars */
import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type AccessToken = string;

declare module 'next-auth/jwt' {
    interface JWT {
        // id: UserId;
        // refreshTokenExpires?: number;
        // accessTokenExpires?: number;
        refresh: string;
        access: string;
        exp: number;
        iat?: number;
        jti?: string;
        email: string;
        username: string;
        user_id: number;
        //accessToken: AccessToken;
    }
}

declare module 'next-auth'{
    interface Session {
        user: User,
        // refreshTokenExpires?: number;
        // accessTokenExpires?: number;
        // refreshToken?: string;
        // accessToken?: string;
        // error?: string;
    }

    interface User {
        access?: string;
        refresh?: string;
        id: number;
        username: string;
        email?: string;
    }
}