import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lista de rotas públicas que não requerem autenticação
  const publicRoutes = ['/login', '/register'];
  const { pathname } = request.nextUrl;

  // Se estiver em rota pública, permitir acesso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Permitir acesso a formulários públicos (rotas /formulario/*)
  if (pathname.startsWith('/formulario/')) {
    return NextResponse.next();
  }

  // Verificar se é uma rota de página (não API)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Se for a rota raiz ou outras rotas protegidas, verificar autenticação
  // Por enquanto, permitir acesso (será implementada quando tivermos Supabase Auth)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

