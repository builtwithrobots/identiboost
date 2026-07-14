import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import ScrollToTop from '@/components/ui/ScrollToTop';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://identiboost.com').replace(/\/$/, '');

const SITE_DESCRIPTION =
  'Your identity, boosted. The professional presence platform that answers back. A verified personal AI anyone can ask questions, plus audio, video, and infographic Boosts, all behind one link.';

export const metadata: Metadata = {
  // Resolves every relative OG/canonical URL and the file-based OG images.
  metadataBase: new URL(APP_URL),
  title: {
    default: 'IdentiBoost: Your identity. Boosted.',
    // Child pages set just their name; this frames it as "Name | IdentiBoost".
    template: '%s | IdentiBoost',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'IdentiBoost',
  keywords: [
    'professional presence platform',
    'identity AI',
    'AI profile',
    'digital business card',
    'professional profile',
    'AI business card',
  ],
  authors: [{ name: 'IdentiBoost' }],
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'IdentiBoost',
    title: 'IdentiBoost: Your identity. Boosted.',
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdentiBoost: Your identity. Boosted.',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/icons/32',
    apple: '/icons/180',
  },
  appleWebApp: {
    capable: true,
    title: 'IdentiBoost',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#D97706',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      >
        <body className="font-body antialiased">
          {children}
          <ScrollToTop />
        </body>
      </html>
    </ClerkProvider>
  );
}
