'use server'

// This file executes ONLY on the Next.js Server (Node.js runtime)

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

// const CLIENT_KEY = process.env.NEXT_PUBLIC_API_CLIENT_KEY;
// const CLIENT_SECRET = process.env.API_CLIENT_SECRET;
const TOKEN_API_URL = process.env.API_BASE_URL;

export async function POST(request) {
    const { client_key, client_secret } = await request.json()

    if (!client_key || !client_secret) {
        return NextResponse.json({ error: "Server credentials missing" }, { status: 500 });
    }

    try {
        // 1. Call Laravel API with private credentials (Safe on Next.js Server)
        const response = await axios.post(`${TOKEN_API_URL}/api-auth/token`, {
            client_key: client_key,
            client_secret: client_secret,
        });
        
        
        // 2. Extract the 'Set-Cookie' header from Laravel's response
        const setCookieHeader = response.headers['set-cookie'];
        const accessControlAllowCredentials = response.headers['access-control-allow-credentials'];
        const accessControlAllowOrigin = response.headers['access-control-allow-origin'];

        // 3. Create the Next.js response
        const nextResponse = NextResponse.json({ token: response?.data?.token, message: "Authenticated successfully" });

        // 4. CRITICAL: Pass the HttpOnly cookie header from Laravel to the client browser
        if (setCookieHeader) {
            nextResponse.headers.set('Set-Cookie', setCookieHeader);
            nextResponse.headers.set('access-control-allow-credentials', accessControlAllowCredentials);
            nextResponse.headers.set('access-control-allow-origin', accessControlAllowOrigin);
        }
        
        
        if(response?.data?.token) {
            const cookieStore = await cookies();
            cookieStore.set('api_token', response?.data?.token, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
              path: "/"
            });
        }

        return nextResponse;

    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error || "Authentication failed.";
        return NextResponse.json({ error: message, origError: error }, { status: status });
    }
}