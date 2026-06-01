import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Vitally — Equipamentos de academia',
  description: 'Equipamentos de academia comerciais e residenciais para força, cardio e treino funcional.',
  icons: {
    icon: '/Icon/Icone1.svg',
  },
  openGraph: {
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
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
