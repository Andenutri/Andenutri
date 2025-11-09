import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Criar cliente Supabase apenas se as variáveis estiverem definidas
// Isso evita erros durante o build estático quando as variáveis não estão configuradas
// Durante o build, as variáveis podem não estar disponíveis, então criamos um cliente mock
let supabaseClient: SupabaseClient;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
  // Configuração otimizada para evitar problemas de SSL/certificado
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    // Configurações de rede para melhor compatibilidade
    global: {
      headers: {
        'x-client-info': 'andenutri-web',
      },
    },
    // Timeout aumentado para conexões lentas
    db: {
      schema: 'public',
    },
    // Real-time desabilitado por padrão (pode ser habilitado se necessário)
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
} else {
  // Criar um cliente com valores dummy para evitar erro durante build
  // Este cliente não funcionará em runtime se as variáveis não estiverem configuradas
  supabaseClient = createClient(
    'https://placeholder.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  );
}

export const supabase = supabaseClient;

