import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Supabase Storage image domains in addition to local images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
