import { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://host.docker.internal:8080/api/v1/:path*',
      },
    ];
  },
}

export default config 
