const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://18.220.85.203:3001/api/:path*", 
      },
    ];
  },
};

module.exports = nextConfig;
