'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Rotas públicas que não requerem autenticação
const publicRoutes = ['/login', '/register'];

// Verificar se uma rota é pública
function isPublicRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  
  // Rotas exatas
  if (publicRoutes.includes(pathname)) return true;
  
  // Rotas de formulário público (qualquer coisa em /formulario/*)
  if (pathname.startsWith('/formulario/')) return true;
  
  return false;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Verificar se a rota atual é pública
  const isPublic = isPublicRoute(pathname);

  useEffect(() => {
    // Se não for rota pública e não estiver autenticado, redirecionar para login
    if (!loading && !isAuthenticated && !isPublic) {
      router.push('/login');
    }
    // Se estiver autenticado e tentar acessar login/register, redirecionar para home
    if (!loading && isAuthenticated && pathname && publicRoutes.includes(pathname)) {
      router.push('/');
    }
  }, [isAuthenticated, loading, isPublic, pathname, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se for rota pública, renderizar sem verificar autenticação
  if (isPublic) {
    return <>{children}</>;
  }

  // Só renderizar conteúdo se autenticado
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

