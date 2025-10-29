'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { signUp, isAuthenticated } = useAuth();

  // Se já estiver autenticado, redirecionar para home
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSuccess(false);

    // Validações
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Verificar se Supabase está configurado
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      // Verificação mais robusta
      const isConfigured = supabaseUrl && 
                            supabaseKey && 
                            supabaseUrl.trim() !== '' && 
                            supabaseKey.trim() !== '' &&
                            !supabaseUrl.includes('placeholder') && 
                            supabaseUrl !== 'https://placeholder.supabase.co' &&
                            supabaseUrl.startsWith('https://');
      
      if (!isConfigured) {
        // Mensagem mais detalhada para ajudar no diagnóstico
        const debugInfo = `URL: ${supabaseUrl ? '✅ definida' : '❌ não definida'} | Key: ${supabaseKey ? '✅ definida' : '❌ não definida'}`;
        setErro(`⚠️ Supabase não está configurado na Vercel. Por favor, configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas configurações da Vercel e faça um redeploy. (${debugInfo})`);
        setLoading(false);
        return;
      }

      const result = await signUp(email, senha, nome);
      const { error, data } = result;
      
      if (error) {
        // Mensagens de erro mais amigáveis
        if (error.message && error.message.includes('Failed to fetch')) {
          setErro('❌ Erro de conexão com o servidor. Verifique se o Supabase está configurado corretamente nas variáveis de ambiente.');
        } else if (error.message && (error.message.includes('already registered') || error.message.includes('User already registered'))) {
          setErro('Este email já está cadastrado. Faça login ou use outro email.');
        } else if (error.message && error.message.includes('Password')) {
          setErro('Senha muito fraca. Use pelo menos 6 caracteres.');
        } else {
          setErro(error.message || 'Erro ao criar conta. Tente novamente.');
        }
        setLoading(false);
        return;
      }

      // Verificar se usuário foi criado e se há sessão (login automático)
      if (data?.user && data?.session) {
        // Login automático bem-sucedido - sessão criada
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
        return;
      } else if (data?.user) {
        // Usuário criado mas precisa confirmar email
        setSuccess(true);
        setErro('');
        // Mostrar mensagem informativa
        alert('✅ Conta criada! Por favor, verifique seu email para confirmar a conta antes de fazer login.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        setLoading(false);
        return;
      }

      // Caso nenhum dos anteriores
      setErro('Erro ao criar conta. Tente novamente.');
      setLoading(false);
    } catch (error: any) {
      console.error('Erro no registro:', error);
      setErro('Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥗</div>
          <h1 className="text-3xl font-bold text-amber-700">Criar Conta</h1>
          <p className="text-gray-600 mt-2">Comece sua jornada como Coach</p>
        </div>

        {/* Formulário de Registro */}
        <form onSubmit={handleRegister} className="space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
              ✅ Conta criada com sucesso! Redirecionando para login...
            </div>
          )}
          {erro && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="Ana Silva"
            />
          </div>

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
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none"
              placeholder="Digite novamente"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem conta?{' '}
            <Link href="/login" className="text-amber-600 hover:underline font-semibold">
              Faça login
            </Link>
          </p>
        </div>

        {/* Termos */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          Ao criar uma conta, você concorda com nossos{' '}
          <Link href="/termos" className="text-amber-600 hover:underline">
            Termos de Uso
          </Link>
        </p>
      </div>
    </div>
  );
}

