import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/consultancy", destination: "/services#consultancy", permanent: true },
      { source: "/programmes", destination: "/services#programmes", permanent: true },
      { source: "/admissions", destination: "/services#admissions", permanent: true },
    ];
  }
};

export default nextConfig;
