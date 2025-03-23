/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["images-na.ssl-images-amazon.com", "patentimages.storage.googleapis.com"],
  },
};

module.exports = nextConfig;
