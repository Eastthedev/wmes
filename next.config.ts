import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/consultancy", destination: "/services#consultancy", permanent: true },
      { source: "/programmes", destination: "/services#programmes", permanent: true },
      { source: "/admissions", destination: "/services#admissions", permanent: true },
    ];
  }
};

export default nextConfig;
