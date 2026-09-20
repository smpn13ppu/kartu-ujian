import type { Metadata, Viewport } from 'next';
import './globals.css';
import Script from 'next/script';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: 'Generator Kartu Ujian Otomatis - Siap Cetak A4 & F4',
  description: 'Aplikasi generator kartu ujian sekolah otomatis dari Excel dan ZIP foto. Siap cetak A4 dan F4.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kartu Ujian',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator && window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function(err) {
                  console.debug('ServiceWorker registration ignored:', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
