import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Guess the Card',
    short_name: 'Guess',
    description: 'Think of one card in twenty-seven and it turns up exactly where you asked.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#000519',
    theme_color: '#000519',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
