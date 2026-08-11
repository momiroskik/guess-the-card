import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const DESCRIPTION =
  'Think of one card in twenty-seven, answer three questions, and watch it turn up exactly where you asked.';

export const metadata: Metadata = {
  title: {
    default: 'Guess the Card',
    template: '%s · Guess the Card',
  },
  description: DESCRIPTION,
  applicationName: 'Guess the Card',
  authors: [{ name: 'Kristijan Momiroski', url: 'https://momiro.ski' }],
  creator: 'Kristijan Momiroski',
  keywords: ['card trick', 'Gergonne', 'three pile trick', 'base 3', 'ternary', 'mind reading'],
  openGraph: {
    type: 'website',
    title: 'Guess the Card',
    description: DESCRIPTION,
    siteName: 'Guess the Card',
  },
  twitter: { card: 'summary_large_image', title: 'Guess the Card', description: DESCRIPTION },
  formatDetection: { telephone: false, address: false, email: false },
  appleWebApp: { capable: true, title: 'Guess the Card', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#000519',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
