import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Vitally | Equipamentos de Academia Premium',
  description: 'Fabricação própria de equipamentos de academia comerciais e de alto padrão. 45 Dias de Fabricação e Financiamento em até 240x.',
  icons: {
    icon: '/Icon/Icone1.svg',
  },
  openGraph: {
    title: 'Vitally | Equipamentos de Academia Premium',
    description: 'Fabricação própria de equipamentos de academia comerciais e de alto padrão. 45 Dias de Fabricação e Financiamento em até 240x.',
    images: [{ url: '/opengraph-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitally | Equipamentos de Academia Premium',
    description: 'Fabricação própria de equipamentos de academia comerciais e de alto padrão. 45 Dias de Fabricação e Financiamento em até 240x.',
    images: [{ url: '/opengraph-image.jpg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
