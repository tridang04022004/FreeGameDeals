import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // CheapShark thumbnails come from many different CDNs (Steam, Epic, GOG, etc.)
    // Use unoptimized for external images to avoid maintaining an allowlist.
    // On Vercel, you can switch to remotePatterns when the full set of CDNs is known.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;


