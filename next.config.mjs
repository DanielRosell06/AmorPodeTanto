/** @type {import('next').NextConfig} */
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;