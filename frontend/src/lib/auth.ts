import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt_decode from "jwt-decode"
import { collapseClasses } from "@mui/material";
import { url } from "inspector";
import { signOut } from "next-auth/react";
import { error } from "console";
import { JWT } from "next-auth/jwt";

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    if (!clientId || clientSecret?.length === 0) {
        throw new Error("Missing Google client ID.");
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing Google client secret.");
    }
    return { clientId, clientSecret }
}

function getGenniferCredentials() {
    const clientId = process.env.GENNIFER_CLIENT_ID
    const clientSecret = process.env.GENNIFER_CLIENT_SECRET
    if (!clientId || clientSecret?.length === 0) {
        throw new Error("Missing Gennifer client ID.");
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing Gennifer client secret.");
    }
    return { clientId, clientSecret }
}

function getCredentials() {
    const url = process.env.CREDENTIALS_URL
    if (!url || url.length === 0) {
        throw new Error("Missing credentials URL.");
    }
    return url;
}

function getUserDetails() {
    const url = process.env.GENNIFER_USER_DETAILS_URL
    if (!url || url.length === 0) {
        throw new Error("Missing Gennifer User Details URL.");
    }
    return url;
}

async function getNewAccessAndRefreshTokens(token: JWT) {
    try {

        // Request newToken (new refresh_token and access_token)
        var urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "refresh_token");
        urlencoded.append("refresh_token", token.refresh_token);
        urlencoded.append("client_id", getGenniferCredentials().clientId);
        urlencoded.append("client_secret", getGenniferCredentials().clientSecret);

        const response = await fetch(getCredentials(), {
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded", 
            },
            body: urlencoded,
            method: "POST",
        })

        const newToken = await response.json();
        newToken.received_at = Date.now()/1000;
        newToken.expires_at = newToken.expires_in + newToken.received_at;
        
        // Request user details using newToken
        const userResponse = await fetch(getUserDetails(), {
            method: "GET",
            headers: { 
                "Authorization": "Bearer " + newToken.access_token,
            },
        });
        const user = await userResponse.json();

        if (!response.ok) throw newToken
        //const user:any = await jwt_decode(newToken.access);
        return {
            ...newToken,
            ...user,
        }
            } catch (error) {
                console.error(error);
                return { ...token, error: "RefreshAccessTokenError" };
            }
  }


export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    // pages: {
    //     signIn: "/login",
    // },
    providers: [
        // GoogleProvider({
        //     clientId: getGoogleCredentials().clientId,
        //     clientSecret: getGoogleCredentials().clientSecret,
        // }),
        CredentialsProvider({
            name: "credentials",
            id: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                let username:string = credentials?.username!;
                let password:string = credentials?.password!;
                var urlencoded = new URLSearchParams();
                urlencoded.append("grant_type", "password");
                urlencoded.append("username", username);
                urlencoded.append("password", password);

                console.log(req);
                const response = await fetch(getCredentials(), {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Basic " + Buffer.from(getGenniferCredentials().clientId + ":" + getGenniferCredentials().clientSecret).toString("base64"), 
                    },
                    body: urlencoded,
                });
                

                const token = await response.json();
                token.received_at = Date.now()/1000;
                token.expires_at = token.received_at + token.expires_in ;

                // Request user details
                const userResponse = await fetch(getUserDetails(), {
                    method: "GET",
                    headers: { 
                        "Authorization": "Bearer " + token.access_token,
                    },
                });
                const user = await userResponse.json();
                //const user:any = await jwt_decode(token.access);
                if (response.ok) {
                    return {
                        ...token,
                        ...user,
                    }
                }
                else { // response is not ok, incorrect credentials provided
                    return null; // Ensures error will be displayed advising user to check credentials
                }
            }
        })
    ],
    callbacks: {
        async redirect({ url, baseUrl}) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        
        async jwt({token, user}) {
            if(user) { // user is being signed in
                return {
                    ...token,
                    ...user,
                };
            } else if ( Math.floor(token.expires_at - Date.now()/1000) > 0 ) { // token has not expired
                return token
            } else { // token has expired
                return getNewAccessAndRefreshTokens(token);
            }
        }, 

        async session({session, token}) {
            if(token) {
                session.user.access = token.access;
                session.user.refresh = token.refresh;
                session.user.access_token = token.access_token;
                session.user.refresh_token = token.refresh_token;
                session.user.expires_in = token.expires_in;
                session.user.issued_at = token.issued_at;
                session.user.expires_at = token.expires_at;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.first_name = token.first_name;
                session.user.last_name = token.last_name;
                // session.user.id = token.user_id;
            }
            session.error = token.error;
            return session;
        },
 
        
    },
}
