import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // jimp and @tensorflow/tfjs use Node.js built-ins — keep them server-side only
  serverExternalPackages: ['jimp', 'sharp'],
};

export default nextConfig;
