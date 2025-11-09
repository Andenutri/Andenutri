# 🔒 Solução de Problemas de SSL/Certificado

## ⚠️ Erro: "NET::ERR_CERT_AUTHORITY_INVALID" ou "Aplicativo impedindo conexão segura"

Este erro geralmente ocorre quando:
- Antivírus/Firewall (como Fortinet) está interceptando conexões HTTPS
- Certificados SSL inválidos na rede
- Proxy corporativo bloqueando conexões

---

## ✅ Soluções para o Usuário Final

### 1. **Desabilitar Temporariamente o Antivírus/Firewall**
   - Abra o Fortinet/FortiClient
   - Desative temporariamente o firewall/proxy
   - Tente acessar novamente

### 2. **Adicionar Exceção no Antivírus**
   - Abra o Fortinet/FortiClient
   - Vá em **Configurações → Firewall/Proxy**
   - Adicione exceção para:
     - `*.supabase.co`
     - `https://supabase.com`
     - `https://seu-projeto.supabase.co`

### 3. **Usar Outro Navegador**
   - Tente Chrome, Firefox ou Safari
   - Pode contornar bloqueios específicos do Edge

### 4. **Conectar em Outra Rede**
   - Use uma rede diferente (ex: celular como hotspot)
   - Evita bloqueios de rede corporativa

### 5. **Verificar Certificado SSL**
   - Clique no cadeado na barra de endereço
   - Verifique se o certificado é válido
   - Se inválido, pode ser problema do antivírus interceptando

---

## 🔧 Configurações Técnicas Implementadas

O sistema já está configurado com:
- ✅ Timeout aumentado para conexões lentas
- ✅ Headers customizados para melhor compatibilidade
- ✅ Tratamento de erros robusto
- ✅ Persistência de sessão otimizada

---

## 📝 Para Desenvolvedores

### Verificar Conexão com Supabase

```javascript
// No console do navegador
const { data, error } = await supabase.from('clientes').select('count');
console.log('Conexão:', error ? '❌ Erro' : '✅ OK');
```

### Logs de Debug

Se houver problemas, verifique:
1. Console do navegador (F12 → Console)
2. Network tab (F12 → Network) para ver requisições bloqueadas
3. Variáveis de ambiente estão configuradas corretamente

---

## 🚨 Se Nada Funcionar

1. **Contate o administrador da rede** para adicionar exceções
2. **Use uma VPN** para contornar bloqueios de rede
3. **Acesse de outro dispositivo/rede** para confirmar se é problema local

---

## 📞 Suporte

Se o problema persistir, forneça:
- Nome do antivírus/firewall
- Mensagem de erro completa
- Screenshot do erro
- Navegador e versão

