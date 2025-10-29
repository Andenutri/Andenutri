import type { Metadata } from 'next';
import './globals.css';
import AuthProviderWrapper from '@/components/AuthProviderWrapper';

export const metadata: Metadata = {
  title: '🥗 ANDENUTRI - Coach de Bem-Estar',
  description: 'Sistema completo de gestão para Coach de Bem-Estar',
  manifest: '/manifest.json',
  themeColor: '#d97706',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ANDENUTRI',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" />
        <meta name="theme-color" content="#d97706" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ANDENUTRI" />
      </head>
      <body className="min-h-screen overflow-y-auto overflow-x-hidden">
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}

