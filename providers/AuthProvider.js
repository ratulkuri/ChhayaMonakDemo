// /app/providers.js
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios'; // We use standard axios here for the single, initial call

/**
 * Executes the initial client authentication against the secure Next.js proxy route.
 * @returns {Promise<void>}
 */
const initializeAuthClient = async () => {
    // Call the Next.js SERVER proxy endpoint!
    // The browser receives the HttpOnly cookie from the response header
    await axios.post('/api/auth/init'); 
};


export function AuthProvider({ children }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Run only once on the client side when the application mounts
        initializeAuthClient()
            .then(() => {
                setIsInitialized(true);
            })
            .catch((e) => {
                // If the very first auth fails, log a critical error
                console.error("Fatal Application Initialization Failure:", e);
                setAuthError("Failed to connect to the API. Please try again.");
                setIsInitialized(true); // Stop loading, show error state
            });
    }, []);

    // if (authError) {
    //     // Show a clear, unrecoverable error for the client
    //     return (
    //         <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
    //             <h1>Authentication Error</h1>
    //             <p>{authError}</p>
    //             <p>Check server logs for details. (Client Secret is NOT exposed).</p>
    //         </div>
    //     );
    // }

    // if (!isInitialized) {
    //     // Show a loading screen while the first token is being acquired
    //     return (
    //         <div style={{ padding: '20px', textAlign: 'center' }}>
    //             Connecting securely to API...
    //         </div>
    //     );
    // }

    return children;
}