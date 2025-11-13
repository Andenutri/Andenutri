-- ================================================
-- TRIGGER PARA PROTEGER is_lead
-- Garante que clientes que compraram o programa
-- nunca voltem a ser leads
-- ================================================

-- Função que valida is_lead antes de atualizar
CREATE OR REPLACE FUNCTION validar_is_lead()
RETURNS TRIGGER AS $$
BEGIN
    -- REGRA: Se data_compra_programa existe, is_lead DEVE ser FALSE
    IF NEW.data_compra_programa IS NOT NULL AND NEW.is_lead = TRUE THEN
        RAISE EXCEPTION 'Cliente que comprou o programa (data_compra_programa existe) não pode ser lead. is_lead deve ser FALSE.';
    END IF;
    
    -- REGRA: Se está tentando mudar is_lead de FALSE para TRUE mas tem data_compra_programa
    IF OLD.is_lead = FALSE AND NEW.is_lead = TRUE AND NEW.data_compra_programa IS NOT NULL THEN
        RAISE EXCEPTION 'Não é possível converter cliente em lead. Cliente já comprou o programa (data_compra_programa existe).';
    END IF;
    
    -- REGRA: Se está tentando mudar is_lead de FALSE para TRUE mas tinha data_compra_programa antes
    IF OLD.is_lead = FALSE AND NEW.is_lead = TRUE AND OLD.data_compra_programa IS NOT NULL THEN
        RAISE EXCEPTION 'Não é possível converter cliente em lead. Cliente já comprou o programa anteriormente.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger antes de UPDATE
DROP TRIGGER IF EXISTS trigger_validar_is_lead ON clientes;
CREATE TRIGGER trigger_validar_is_lead
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    WHEN (OLD.is_lead IS DISTINCT FROM NEW.is_lead OR OLD.data_compra_programa IS DISTINCT FROM NEW.data_compra_programa)
    EXECUTE FUNCTION validar_is_lead();

-- Criar trigger antes de INSERT também (para garantir na criação)
DROP TRIGGER IF EXISTS trigger_validar_is_lead_insert ON clientes;
CREATE TRIGGER trigger_validar_is_lead_insert
    BEFORE INSERT ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION validar_is_lead();

RAISE NOTICE '✅ Triggers criados para proteger is_lead';
RAISE NOTICE '✅ Agora é impossível marcar como lead um cliente que comprou o programa';

