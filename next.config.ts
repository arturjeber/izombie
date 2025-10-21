import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,

  // Garante build compatível com Azure e evita acesso a banco no build
  output: 'standalone',

  // Desabilita o comportamento que tenta coletar dados no build
  experimental: {
    // nada de dynamicIO / cacheComponents aqui
    serverActions: {
      allowedOrigins: ['*'],
    },
  },

  // Apenas organização de extensões (não interfere no build)
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

export default nextConfig;
