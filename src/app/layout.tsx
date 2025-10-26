import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🥗 ANDENUTRI - Dashboard',
  description: 'Coach de Bem-Estar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}

