import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow CheapShark thumbnails (served from various Steam/Epic/GOG CDNs).
    // The wildcard hostname (**) is needed because game thumbnails come from
    // many different CDN hostnames that can change. remotePatterns only governs
    // the next/image optimization endpoint — it does NOT affect plain <img> tags.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Add response headers for every route.
  // This is the critical fix for Vercel deployments: plain <img> tags loading
  // images from cheapshark.com are blocked by Vercel's default Content-Security-Policy
  // unless the domain is explicitly whitelisted in img-src.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              // Allow resources from self
              "default-src 'self'",
              // Allow scripts from self + inline (needed for Next.js hydration)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Allow styles from self + inline (needed for Tailwind / styled-jsx)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Allow fonts from Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // ─── KEY FIX ───────────────────────────────────────────────────
              // Allow images from:
              //   • self (public/ assets)
              //   • data: URIs (Next.js blur placeholders)
              //   • cheapshark.com (store icons + thumbnails)
              //   • *.steampowered.com (Steam CDN game thumbnails)
              //   • *.epicgames.com (Epic CDN thumbnails)
              //   • *.gogcdn.net (GOG CDN thumbnails)
              //   • *.humblebundle.com (Humble CDN thumbnails)
              //   • *.fanatical.com (Fanatical CDN thumbnails)
              //   • *.akamaized.net, *.cloudfront.net, *.fastly.net (common CDNs)
              "img-src 'self' data: https://www.cheapshark.com https://*.steampowered.com https://*.epicgames.com https://*.gogcdn.net https://*.humblebundle.com https://*.fanatical.com https://*.akamaized.net https://*.cloudfront.net https://*.fastly.net https://*.steamstatic.com https://cdn.cloudflare.steamstatic.com",
              // Allow connections to CheapShark API
              "connect-src 'self' https://www.cheapshark.com",
              // Block all frames
              "frame-src 'none'",
              // Block all objects (Flash, etc.)
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;


