/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['staging.qatar.chhaya.life'],
    async headers() {
        return [
          {
            source: "/api/:path*",
            headers: [
              {
                key: "Access-Control-Allow-Origin",
                value: "https://staging.qatar.chhaya.life",
              },
              {
                key: "Access-Control-Allow-Methods",
                value: "GET, POST, PUT, DELETE, OPTIONS",
              },
              {
                key: "Access-Control-Allow-Headers",
                value: "Content-Type, Authorization, X-Signature",
              },
              {
                key: "Access-Control-Allow-Credentials",
                value: "true",
              },
            ],
          },
        ];
      },
};

export default nextConfig;