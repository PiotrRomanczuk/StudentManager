/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: 
{
  ignoreDuringBuilds: ['src/__tests__/'],
},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

module.exports = nextConfig;
