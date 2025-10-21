import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,

  // 🔹 Importante: força que páginas sejam renderizadas dinamicamente
  // (evita "collecting page data" tentar conectar ao banco durante o build)
  experimental: {
    dynamicIO: true,
  },

  // 🔹 Garante que o runtime seja Node.js (essencial no Azure)
  output: 'standalone',

  turbopack: {
    resolveAlias: {},
    rules: {},
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

export default nextConfig;
