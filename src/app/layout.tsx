import type { Metadata } from 'next';

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

