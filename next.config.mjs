/** @type {import('next').NextConfig} */

const nextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
