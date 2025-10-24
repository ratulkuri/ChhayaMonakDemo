export const AppConfig = {
    'apiTokenBaseUrl': process.env.NEXT_PUBLIC_API_TOKEN_BASE_URL || 'localhost:8000/api',
    'clientSecret': process.env.API_CLIENT_SECRET || '',
    'clientKey': process.env.NEXT_PUBLIC_API_CLIENT_KEY || '',
}