import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://vitallyoficial.com.br'),
  title: {
    default: 'Vitally | Equipamentos de Academia Premium',
    template: '%s | Vitally',
  },
  description: 'Fabricação própria de equipamentos de academia comerciais e de alto padrão. 45 Dias de Fabricação e Financiamento em até 240x.',
  keywords: [
    'equipamentos de academia',
    'equipamentos de ginástica',
    'musculação',
    'academia comercial',
    'fabricante de equipamentos',
    'vitally',
    'financiamento academia',
  ],
  authors: [{ name: 'Vitally Indústria de Aparelhos para Ginástica LTDA' }],
  creator: 'Vitally',
  publisher: 'Vitally',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/Icon/Icone1.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://vitallyoficial.com.br',
    siteName: 'Vitally',
    title: 'Vitally | Equipamentos de Academia Premium',
    description: 'Fabricação própria de equipamentos de academia comerciais e de alto padrão. 45 Dias de Fabricação e Financiamento em até 240x.',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vitally — Equipamentos de Academia Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitally | Equipamentos de Academia Premium',
    description: 'Fabricação própria de equipamentos de academia comerciais e de alto padrão. 45 Dias de Fabricação e Financiamento em até 240x.',
    images: ['/opengraph-image.jpg'],
  },
  alternates: {
    canonical: 'https://vitallyoficial.com.br',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <GoogleTagManager gtmId="GTM-KHP9XBL6" />
      <body className={`${inter.variable} font-sans antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KHP9XBL6"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
