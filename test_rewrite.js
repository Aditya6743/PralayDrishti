const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*", // Vercel native handles it?
      },
    ];
  },
};
