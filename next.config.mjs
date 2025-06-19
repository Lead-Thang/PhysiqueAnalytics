/** @type {import('next').NextConfig} */
const nextConfig = { // Keeping the .mjs version as it's prioritized
  experimental: {
    optimizePackageImports: ["@react-three/drei", "@react-three/fiber"],
  },
  transpilePackages: ["three"],
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
