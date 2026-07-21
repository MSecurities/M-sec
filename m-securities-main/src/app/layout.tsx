// src/app/layout.tsx
import './styles/globals.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { Providers } from './context/providers';
import { Roboto } from 'next/font/google';
import defaultMetadata from './metadata';
import { Metadata } from 'next';

// Configure Roboto font
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL('https://msecurities.mn'),
  alternates: {
    canonical: 'https://msecurities.mn',
    languages: {
      'en-US': '/en',
      'mn-MN': '/mn',
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${roboto.variable} font-sans`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#14b8a6" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="canonical" href="https://msecurities.mn" />
      </head>
      <body className="font-sans">
        <Providers>
          <div className="min-h-screen bg-white dark:bg-[#26282c] transition-colors duration-200">
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
  