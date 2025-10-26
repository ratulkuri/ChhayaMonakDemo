'server api'

// /utils/serverFetch.js

import { cookies } from 'next/headers'; 
// We use 'node-fetch' or similar logic here for the server-to-server call.
// Since we are running in the Node.js environment of Next.js, we can use 
// native global fetch for the proxy call as well.

const X_SIGNATURE = process.env.X_SIGNATURE ?? "";
const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
const INTERNAL_AUTH_ENDPOINT = '/api/auth/init'; // The secure proxy route

/**
 * Executes a call to the internal authentication proxy to refresh the token.
 * This is a server-to-server call.
 * @returns {Promise<string|null>} The new API token string or null on failure.
 */
async function refreshAuthToken() {
    try {
        // Call the internal Next.js Route Handler/Proxy to get a new cookie
        // We use fetch directly and instruct it to forward the existing request cookies.
        const res = await fetch(`${process.env.APP_BASE_URL}${INTERNAL_AUTH_ENDPOINT}`, { 
            method: 'POST', 
            cache: 'no-store',
            body: JSON.stringify({
                client_key: process.env.NEXT_PUBLIC_API_CLIENT_KEY,
                client_secret: process.env.API_CLIENT_SECRET,
            }),
            // CRITICAL: We need to ensure any existing session cookie/context is 
            // available to the proxy handler, but since the proxy only cares 
            // about setting the *new* HttpOnly cookie, we simplify the call:
        });

        // The key action of the internal proxy is setting the 'Set-Cookie' header.
        // On success, we assume the new cookie has been correctly set on the response
        // headers which Next.js forwards to the browser.
        if (res.ok) {
            // Because this function is running within a Server Component context,
            // we must rely on the **cookies().set()** method to guarantee the new cookie
            // is available for the retry AND is sent back to the browser.
            // *However*, calling the internal proxy (Route Handler) is the simplest way 
            // to leverage the logic that already handles reading secrets and setting 
            // the `Set-Cookie` header on the final HTTP response.

            // Since we can't easily read the new token from the proxy's response body 
            // (it only returns a success message) we have to re-read the cookie store.
            // A more robust solution might have the proxy return the new token directly 
            // in the JSON body, but for this pattern, let's re-read the store.
            
            // Re-read the cookie store after the successful refresh (Next.js context might update)
            const data = await res.json();
            const token = data?.token || null;

            // Return the new token for use in the retry
            return token;

        } else {
            console.error(`Token refresh failed with status: ${res.status}`);
            return null;
        }
    } catch (e) {
        console.error("Exception during token refresh:", e);
        return null;
    }
}


/**
 * Fetches data from the internal API using the HttpOnly cookie for authorization.
 * Includes automatic token refresh and retry on a 401 error.
 * * @param {string} endpoint The API path (e.g., '/get-products').
 * @param {RequestInit} [options={}] Optional fetch options.
 * @returns {Promise<Response>} The raw fetch Response object.
 */
export async function serverFetch(endpoint, options = {}) {
    
    // 1. Initial attempt configuration
    let cookieStore = await cookies();
    let apiTokenCookie = cookieStore.get('api_token');
    let apiToken = apiTokenCookie ? apiTokenCookie.value : null;
    
    // We will use a mutable request configuration
    let currentOptions = options; 

    // 2. The main fetching logic loop
    for (let i = 0; i < 2; i++) { // Max 2 attempts (initial + 1 retry after refresh)

        // 3. Prepare headers for the current attempt
        const authHeader = apiToken ? `Bearer ${apiToken}` : undefined;

        const defaultHeaders = {
            'x-signature': X_SIGNATURE,
            ...(authHeader && { 'Authorization': authHeader }),
            ...((currentOptions.method && currentOptions.method !== 'GET') && { 'Content-Type': 'application/json' }) 
        };

        const headers = {
            ...defaultHeaders,
            ...(currentOptions.headers || {}),
        };
        
        // 4. Execute the fetch request
        const url = `${API_BASE_URL}${endpoint}`;
        const cacheOption = currentOptions.cache || 'no-store';

        const response = await fetch(url, {
            ...currentOptions,
            cache: cacheOption,
            headers: headers,
        });

        // 5. Check response status
        if (response.ok) {
            // Success: return the response immediately
            return response;

        } else if (response.status === 401 && i === 0) {
            // 6. Handle 401 on the first attempt (token expired)
            console.warn('401 detected in Server Component. Attempting token refresh...');
            
            // Call the refresh utility
            const newToken = await refreshAuthToken();

            if (newToken) {
                // Update token for retry and continue the loop
                apiToken = newToken;
                console.log('Token refreshed successfully. Retrying request...');
                continue; // Retry the loop with the new token

            } else {
                // Refresh failed: break the loop, return the 401 response
                console.error('Token refresh failed. Aborting retry.');
                return response; 
            }
        } else {
            // 7. Non-401 error, or 401 on the second attempt: return the response
            return response;
        }
    }
    
    // Should be unreachable, but just in case
    throw new Error("Server fetch logic failed to resolve or retry."); 
}