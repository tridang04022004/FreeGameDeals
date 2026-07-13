import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeToggle } from '@/components/ThemeToggle';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FreeGameDeals',
  description:
    'Find every free PC game deal right now. We track 100%-off promotional giveaways from Epic Games, GOG, Steam, Humble Bundle, and more — updated every 24 hours via CheapShark.',
  keywords: ['free games', 'PC game deals', 'game giveaways', 'epic games free', 'steam free games', 'CheapShark'],
  openGraph: {
    title: 'FreeGameDeals',
    description: 'Find every free PC game deal right now, updated every 24 hours.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--bg-surface)] border-b-2 border-[var(--border-color)] nb-shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-end">
            <ThemeToggle />
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
