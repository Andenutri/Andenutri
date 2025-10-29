'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, isAuthenticated } = useAuth();

  // Se já estiver autenticado, redirecionar para home
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const { error } = await signIn(email, senha);
      
      if (error) {
        // Mensagens de erro mais amigáveis
        if (error.message.includes('Invalid login credentials')) {
          setErro('Email ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          setErro('Por favor, confirme seu email antes de fazer login');
        } else {
          setErro(error.message || 'Erro ao fazer login. Tente novamente.');
        }
        setLoading(false);
        return;
      }

      // Login bem-sucedido - o AuthContext já atualizará o estado
      router.push('/');
    } catch (error: any) {
      setErro('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥗</div>
          <h1 className="text-3xl font-bold text-amber-700">ANDENUTRI</h1>
          <p className="text-gray-600 mt-2">Coach de Bem-Estar</p>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          {erro && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <Link href="/recuperar-senha" className="text-sm text-amber-600 hover:underline block">
            Esqueceu a senha?
          </Link>
          <p className="text-sm text-gray-600">
            Não tem conta?{' '}
            <Link href="/register" className="text-amber-600 hover:underline font-semibold">
              Registre-se
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 text-center">
            <strong>💡 Dica:</strong><br />
            Crie sua conta em "Registre-se" ou entre com suas credenciais do Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}

