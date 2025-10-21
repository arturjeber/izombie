import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  experimental: {
    turbo: {
      resolveAlias: {},
      rules: {},
      // Habilita geração de source maps (experimental)
      resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
};

export default nextConfig;
