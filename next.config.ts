import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/awknwithin",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
