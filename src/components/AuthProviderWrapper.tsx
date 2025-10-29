'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </AuthProvider>
  );
}

