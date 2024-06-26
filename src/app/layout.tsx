import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import cn from 'classnames';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'App de gestión de condóminios',
  title: 'Zenith Residencial',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={cn(inter.className, 'bg-slate-100')}>{children}</body>
    </html>
  );
}
