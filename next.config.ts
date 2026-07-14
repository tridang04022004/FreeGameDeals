import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // CheapShark thumbnails come from many different CDNs (Steam, Epic, GOG, etc.)
    // remotePatterns only applies to next/image — plain <img> tags are unaffected.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;



