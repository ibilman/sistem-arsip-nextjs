import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sistem Arsip Surat',
  description: 'Sistem Manajemen Arsip Surat Digital',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.className} h-full`}>
        {children}
      </body>
    </html>
  );
}