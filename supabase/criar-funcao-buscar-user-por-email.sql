-- ================================================
-- FUNÇÃO: Buscar user_id por email
-- Permite buscar o ID do nutricionista pelo email para associar formulários
-- ================================================

CREATE OR REPLACE FUNCTION buscar_user_id_por_email(email_param TEXT)
RETURNS UUID AS $$
DECLARE
    user_id_found UUID;
BEGIN
    SELECT id INTO user_id_found
    FROM auth.users
    WHERE LOWER(email) = LOWER(email_param)
    LIMIT 1;
    
    RETURN user_id_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário
COMMENT ON FUNCTION buscar_user_id_por_email IS 'Busca o user_id (UUID) de um nutricionista pelo email. Usado para associar formulários públicos aos nutricionistas corretos.';

-- ================================================
-- TESTE: Verificar função
-- ================================================

-- Exemplo de uso:
-- SELECT buscar_user_id_por_email('deisefaula@gmail.com');

