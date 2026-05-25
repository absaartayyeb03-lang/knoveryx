import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        // REMOVED 'https://' from the hostname
        hostname: 'ydkolpwfukpfzjxyqsjc.supabase.co', 
      },
      {
      protocol: 'https',
        hostname: 'images.unsplash.com',
        },
    ],
  },
};

export default nextConfig;