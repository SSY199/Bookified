import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "https",
        hostname: "wqkfw40pupgonoaj.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
