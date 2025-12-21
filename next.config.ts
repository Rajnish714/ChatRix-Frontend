import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // reactStrictMode: false, 
  reactCompiler: true,
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "api.dicebear.com",
    },
    {
      protocol: "https",
      hostname: "media.tenor.com",
    },
  ],
},
  async rewrites() {
    return [
      {

        source: "/api/:path*",
        destination: "http://localhost:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
