import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    proxyClientMaxBodySize: "120mb",
    serverActions: {
      bodySizeLimit: "120mb",
    },
  },
};

export default nextConfig;
