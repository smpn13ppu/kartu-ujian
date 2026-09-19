import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Generator Kartu Ujian Otomatis - Siap Cetak A4 & F4',
  description: 'Aplikasi generator kartu ujian sekolah otomatis dari Excel dan ZIP foto. Siap cetak A4 dan F4.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
