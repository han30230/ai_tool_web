/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
      { protocol: "https", hostname: "www.google.com", pathname: "/**" },
      { protocol: "https", hostname: "t0.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "image.thum.io", pathname: "/**" },
      { protocol: "https", hostname: "api.microlink.io", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
