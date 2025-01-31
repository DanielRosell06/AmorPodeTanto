/** @type {import('next').NextConfig} */
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });

const nextConfig = {};

export default nextConfig;