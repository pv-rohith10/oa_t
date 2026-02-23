/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/open-agent/dashboard",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/open-agent/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
