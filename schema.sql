-- ============================================
-- ESQUEMA COMPLETO DO BANCO DE DADOS - APOIAPP
-- PostgreSQL (Supabase)
-- ============================================

-- ============================================
-- TIPOS ENUM
-- ============================================
CREATE TYPE tipo_meta AS ENUM ('performance', 'habit');
CREATE TYPE tipo_progresso AS ENUM ('amount', 'completed', 'streak', 'weekly');

-- ============================================
-- 1. USUÁRIOS
-- ============================================
CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NULL,
  senha_hash TEXT NOT NULL,
  imagem_perfil_url TEXT NULL,
  data_cadastro TIMESTAMP DEFAULT NOW(),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX usuario_email_idx ON usuarios (LOWER(email));

COMMENT ON COLUMN usuarios.id IS 'ID único do usuário';
COMMENT ON COLUMN usuarios.email IS 'Email único do usuário (case-insensitive)';
COMMENT ON COLUMN usuarios.telefone IS 'Telefone do usuário no formato internacional';

-- ============================================
-- 2. CARTÕES
-- ============================================
CREATE TABLE cartoes (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  nome VARCHAR(80) NOT NULL,
  ultimos_4_digitos VARCHAR(4) NULL,
  bandeira VARCHAR(30) NULL,
  limite_total DECIMAL(12,2) NULL,
  limite_disponivel DECIMAL(12,2) NULL,
  dia_vencimento INTEGER NULL,
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX cartao_usuario_idx ON cartoes (usuario_id);

-- ============================================
-- 3. TRANSAÇÕES (Receitas e Despesas)
-- ============================================
-- DOCUMENTAÇÃO PARA INTEGRAÇÃO COM IA (Leitura de Boletos):
-- 
-- Para cadastrar uma DESPESA via API (POST /api/transacoes), a IA precisa enviar:
--
-- CAMPOS OBRIGATÓRIOS:
--   - tipo: 'despesa' (string, fixo)
--   - descricao: Texto extraído do boleto (ex: "CONTA DE LUZ", "FATURA ENERGIA") - máximo 200 caracteres
--   - valor: Valor numérico extraído do boleto (ex: 150.50) - deve ser > 0
--   - data_transacao: Data da transação no formato YYYY-MM-DD (ex: "2024-11-20")
--   - forma_pagamento: Uma das opções: 'dinheiro', 'pix', 'debito', 'credito', 'outro'
--     (Para boletos, geralmente usar 'boleto' não existe, então usar 'outro' ou inferir do contexto)
--
-- CAMPOS OPCIONAIS (mas recomendados para boletos):
--   - categoria: Categoria inferida do boleto (ex: "Contas", "Energia", "Água") - máximo 50 caracteres
--   - data_vencimento: Data de vencimento do boleto no formato YYYY-MM-DD
--   - data_pagamento: Se o boleto já foi pago, data do pagamento no formato YYYY-MM-DD
--   - paga: true/false - indica se o boleto já foi pago (padrão: false)
--   - observacao: Informações adicionais extraídas do boleto (código de barras, linha digitável, etc.)
--   - cartao_id: ID do cartão se a despesa foi paga com cartão (NULL se não aplicável)
--
-- EXEMPLO DE PAYLOAD PARA IA - DESPESA:
-- {
--   "tipo": "despesa",
--   "descricao": "CONTA DE ENERGIA ELÉTRICA - REF NOV/2024",
--   "valor": 245.80,
--   "categoria": "Contas",
--   "data_transacao": "2024-11-20",
--   "forma_pagamento": "outro",
--   "data_vencimento": "2024-11-25",
--   "paga": false,
--   "observacao": "Código de barras: 34191.09008 01234.567890 12345.678901 2 98760000024580"
-- }
--
-- EXEMPLO DE PAYLOAD PARA IA - RECEITA:
-- {
--   "tipo": "receita",
--   "descricao": "Salário - Novembro 2024",
--   "valor": 3500.00,
--   "categoria": "Salário",
--   "data_transacao": "2024-11-05",
--   "forma_pagamento": "pix",
--   "observacao": "Depósito automático - Empresa XYZ"
-- }
--
-- NOTAS IMPORTANTES:
--   - O usuario_id é automaticamente obtido do token de autenticação (não precisa enviar)
--   - Se forma_pagamento for 'credito' ou 'debito', o cartao_id se torna obrigatório
--   - Para boletos, geralmente forma_pagamento será 'outro' ou 'pix' (se identificado como PIX)
--   - A data_transacao pode ser a data de emissão do boleto ou a data atual
--   - A data_vencimento é crucial para boletos e deve ser extraída do documento
--
CREATE TABLE transacoes (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  cartao_id BIGINT NULL,
  tipo VARCHAR(20) NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  categoria VARCHAR(50) NULL,
  data_transacao DATE NOT NULL,
  forma_pagamento VARCHAR(20) NULL,
  data_vencimento DATE NULL,
  data_pagamento DATE NULL,
  paga BOOLEAN DEFAULT false,
  observacao TEXT NULL,
  data_criacao TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cartao_id) REFERENCES cartoes(id) ON DELETE SET NULL
);

CREATE INDEX transacao_usuario_data_idx ON transacoes (usuario_id, data_transacao DESC);
CREATE INDEX transacao_usuario_tipo_idx ON transacoes (usuario_id, tipo);

COMMENT ON COLUMN transacoes.usuario_id IS 'Obtido automaticamente do token de autenticação';
COMMENT ON COLUMN transacoes.cartao_id IS 'Obrigatório apenas se forma_pagamento for credito ou debito';
COMMENT ON COLUMN transacoes.tipo IS 'receita ou despesa - Para boletos sempre usar "despesa"';
COMMENT ON COLUMN transacoes.descricao IS 'OBRIGATÓRIO: Texto extraído do boleto (ex: "CONTA DE LUZ")';
COMMENT ON COLUMN transacoes.valor IS 'OBRIGATÓRIO: Valor numérico extraído (ex: 150.50) - deve ser > 0';
COMMENT ON COLUMN transacoes.categoria IS 'OPCIONAL: Categoria inferida (ex: "Contas", "Energia")';
COMMENT ON COLUMN transacoes.data_transacao IS 'OBRIGATÓRIO: Data no formato YYYY-MM-DD (data do boleto ou atual)';
COMMENT ON COLUMN transacoes.forma_pagamento IS 'OBRIGATÓRIO para despesas: dinheiro, pix, debito, credito, outro';
COMMENT ON COLUMN transacoes.data_vencimento IS 'OPCIONAL mas RECOMENDADO: Data de vencimento do boleto (YYYY-MM-DD)';
COMMENT ON COLUMN transacoes.data_pagamento IS 'OPCIONAL: Data de pagamento se paga=true (YYYY-MM-DD)';
COMMENT ON COLUMN transacoes.paga IS 'OPCIONAL: true se boleto já foi pago, false caso contrário';
COMMENT ON COLUMN transacoes.observacao IS 'OPCIONAL: Código de barras, linha digitável ou outras informações do boleto';

-- ============================================
-- 4. METAS
-- ============================================
CREATE TABLE metas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NULL,
  tipo tipo_meta NOT NULL,
  icone VARCHAR(50) NULL,
  cor_icone VARCHAR(20) NULL,
  tipo_progresso tipo_progresso DEFAULT 'amount',
  valor_atual DECIMAL(12,2) DEFAULT 0,
  valor_meta DECIMAL(12,2) NULL,
  sequencia_atual INTEGER DEFAULT 0,
  concluida BOOLEAN DEFAULT false,
  pontos INTEGER DEFAULT 0,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX metas_usuario_idx ON metas (usuario_id);

-- ============================================
-- 5. DESPESAS FIXAS
-- ============================================
CREATE TABLE despesas_fixas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  categoria VARCHAR(50) NULL,
  dia_vencimento INTEGER NOT NULL,
  forma_pagamento VARCHAR(20) DEFAULT 'pix',
  cartao_id BIGINT NULL,
  ativa BOOLEAN DEFAULT true,
  observacao TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cartao_id) REFERENCES cartoes(id) ON DELETE SET NULL
);

CREATE INDEX despesas_fixas_usuario_idx ON despesas_fixas (usuario_id);
CREATE INDEX despesas_fixas_usuario_dia_idx ON despesas_fixas (usuario_id, dia_vencimento);

COMMENT ON COLUMN despesas_fixas.dia_vencimento IS 'Dia do mês (1-31)';
COMMENT ON COLUMN despesas_fixas.forma_pagamento IS 'dinheiro, pix, debito, credito, outro';

-- ============================================
-- 6. PERFIL DE GAMIFICAÇÃO
-- ============================================
CREATE TABLE perfil_gamificacao (
  usuario_id BIGINT PRIMARY KEY,
  nivel INTEGER DEFAULT 1,
  experiencia_atual INTEGER DEFAULT 0,
  experiencia_proximo_nivel INTEGER DEFAULT 100,
  pontos_totais INTEGER DEFAULT 0,
  sequencia_dias INTEGER DEFAULT 0,
  data_ultimo_login DATE NULL,
  data_atualizacao TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================
-- 7. PERSONAL ACCESS TOKENS (Laravel Sanctum)
-- ============================================
CREATE TABLE personal_access_tokens (
  id BIGSERIAL PRIMARY KEY,
  tokenable_type VARCHAR(255) NOT NULL,
  tokenable_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  abilities TEXT NULL,
  last_used_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE INDEX personal_access_tokens_tokenable_idx ON personal_access_tokens (tokenable_type, tokenable_id);

-- ============================================
-- INSERÇÃO DO USUÁRIO DE TESTE
-- ============================================
INSERT INTO usuarios (nome, email, telefone, senha_hash, imagem_perfil_url, data_cadastro, ativo, created_at, updated_at) 
VALUES (
  'Gabriel Cordeiro Barroso Teles',
  'gabrielcordeirobarroso@gmail.com',
  '+55859977525271',
  '$2y$10$uIgoss.tdhCa2owSImVvu.EJqE5.0ZrkhZO1h/2EoNNqPyGFQFV0K',
  NULL,
  NOW(),
  true,
  NOW(),
  NOW()
);

-- Criar perfil de gamificação para o usuário
INSERT INTO perfil_gamificacao (usuario_id, nivel, experiencia_atual, experiencia_proximo_nivel, pontos_totais, sequencia_dias, data_ultimo_login, data_atualizacao, created_at, updated_at)
SELECT 
  id,
  1,
  0,
  100,
  0,
  0,
  NULL,
  NOW(),
  NOW(),
  NOW()
FROM usuarios 
WHERE email = 'gabrielcordeirobarroso@gmail.com';

-- ============================================
-- DOCUMENTAÇÃO PARA INTEGRAÇÃO COM IA
-- ============================================
-- 
-- ENDPOINT: POST /api/transacoes
-- 
-- AUTENTICAÇÃO: Requer token Bearer no header Authorization
-- Header: Authorization: Bearer {token_do_usuario}
-- Content-Type: application/json
--
-- ============================================
-- 1. CADASTRAR DESPESA (BOLETO/COMPROVANTE)
-- ============================================
--
-- CAMPOS OBRIGATÓRIOS:
--   - tipo: "despesa" (string, fixo)
--   - descricao: Texto extraído do documento (string, max 200 chars)
--   - valor: Valor numérico extraído (decimal, min 0.01)
--   - data_transacao: Data no formato YYYY-MM-DD
--   - forma_pagamento: "dinheiro", "pix", "debito", "credito" ou "outro"
--
-- CAMPOS OPCIONAIS (recomendados):
--   - categoria: Categoria inferida (ex: "Contas", "Energia", "Água")
--   - data_vencimento: Data de vencimento (YYYY-MM-DD)
--   - data_pagamento: Data de pagamento se já foi pago (YYYY-MM-DD)
--   - paga: true/false (padrão: false)
--   - observacao: Código de barras, linha digitável, etc.
--   - cartao_id: ID do cartão (obrigatório se forma_pagamento for "credito" ou "debito")
--
-- EXEMPLO DE PAYLOAD - DESPESA (BOLETO):
-- {
--   "tipo": "despesa",
--   "descricao": "CONTA DE ENERGIA ELÉTRICA - REF NOV/2024",
--   "valor": 245.80,
--   "categoria": "Contas",
--   "data_transacao": "2024-11-20",
--   "forma_pagamento": "outro",
--   "data_vencimento": "2024-11-25",
--   "paga": false,
--   "observacao": "Código de barras: 34191.09008 01234.567890 12345.678901 2 98760000024580"
-- }
--
-- EXEMPLO DE PAYLOAD - DESPESA (COMPROVANTE PIX):
-- {
--   "tipo": "despesa",
--   "descricao": "Pagamento PIX - Supermercado",
--   "valor": 156.90,
--   "categoria": "Alimentação",
--   "data_transacao": "2024-11-20",
--   "forma_pagamento": "pix",
--   "paga": true,
--   "data_pagamento": "2024-11-20"
-- }
--
-- EXEMPLO DE PAYLOAD - DESPESA (CARTÃO DE CRÉDITO):
-- {
--   "tipo": "despesa",
--   "descricao": "Compra no cartão - Loja XYZ",
--   "valor": 89.50,
--   "categoria": "Compras",
--   "data_transacao": "2024-11-20",
--   "forma_pagamento": "credito",
--   "cartao_id": 1,
--   "paga": false
-- }
--
-- ============================================
-- 2. CADASTRAR RECEITA (COMPROVANTE/DEPÓSITO)
-- ============================================
--
-- CAMPOS OBRIGATÓRIOS:
--   - tipo: "receita" (string, fixo)
--   - descricao: Texto extraído do documento (string, max 200 chars)
--   - valor: Valor numérico extraído (decimal, min 0.01)
--   - data_transacao: Data no formato YYYY-MM-DD
--
-- CAMPOS OPCIONAIS (recomendados):
--   - categoria: Categoria inferida (ex: "Salário", "Freelance", "Venda")
--   - forma_pagamento: "dinheiro", "pix", "debito", "credito" ou "outro" (opcional para receita)
--   - observacao: Informações adicionais do comprovante
--   - cartao_id: ID do cartão se recebido via cartão
--
-- EXEMPLO DE PAYLOAD - RECEITA (DEPÓSITO SALÁRIO):
-- {
--   "tipo": "receita",
--   "descricao": "Salário - Novembro 2024",
--   "valor": 3500.00,
--   "categoria": "Salário",
--   "data_transacao": "2024-11-05",
--   "forma_pagamento": "pix",
--   "observacao": "Depósito automático - Empresa XYZ"
-- }
--
-- EXEMPLO DE PAYLOAD - RECEITA (PIX RECEBIDO):
-- {
--   "tipo": "receita",
--   "descricao": "Pagamento Freelance - Projeto ABC",
--   "valor": 1200.00,
--   "categoria": "Freelance",
--   "data_transacao": "2024-11-20",
--   "forma_pagamento": "pix",
--   "observacao": "PIX recebido de João Silva"
-- }
--
-- EXEMPLO DE PAYLOAD - RECEITA (VENDA):
-- {
--   "tipo": "receita",
--   "descricao": "Venda de produto - Item XYZ",
--   "valor": 450.00,
--   "categoria": "Venda",
--   "data_transacao": "2024-11-20",
--   "forma_pagamento": "dinheiro"
-- }
--
-- ============================================
-- CATEGORIAS SUGERIDAS
-- ============================================
--
-- CATEGORIAS PARA DESPESAS:
--   - "Contas" (genérico para boletos)
--   - "Energia" (conta de luz)
--   - "Água" (conta de água)
--   - "Internet" (provedor de internet)
--   - "Telefone" (telefonia)
--   - "TV/Streaming" (TV a cabo, streaming)
--   - "Alimentação" (supermercado, restaurante)
--   - "Transporte" (combustível, transporte público)
--   - "Saúde" (farmácia, médico)
--   - "Educação" (cursos, material escolar)
--   - "Impostos" (impostos e taxas)
--   - "Seguro" (seguros diversos)
--   - "Financiamento" (parcelas de financiamento)
--   - "Compras" (compras diversas)
--   - "Outros" (quando não conseguir identificar)
--
-- CATEGORIAS PARA RECEITAS:
--   - "Salário" (salário fixo)
--   - "Freelance" (trabalhos autônomos)
--   - "Investimento" (rendimentos de investimentos)
--   - "Venda" (venda de produtos/serviços)
--   - "Aluguel" (recebimento de aluguel)
--   - "Dividendos" (dividendos de ações)
--   - "Presente" (dinheiro recebido como presente)
--   - "Reembolso" (reembolsos diversos)
--   - "Outros" (outras receitas)
--
-- ============================================
-- VALIDAÇÕES IMPORTANTES
-- ============================================
--
-- REGRAS GERAIS:
--   - valor: deve ser numérico e maior que 0.01
--   - data_transacao: deve estar no formato YYYY-MM-DD válido
--   - descricao: máximo 200 caracteres
--   - categoria: máximo 50 caracteres
--
-- REGRAS ESPECÍFICAS PARA DESPESA:
--   - forma_pagamento: OBRIGATÓRIO (uma das opções: dinheiro, pix, debito, credito, outro)
--   - Se forma_pagamento for "credito" ou "debito": cartao_id se torna obrigatório
--
-- REGRAS ESPECÍFICAS PARA RECEITA:
--   - forma_pagamento: OPCIONAL (pode ser omitido)
--   - cartao_id: OPCIONAL (geralmente não usado para receitas)
--
-- ============================================
-- RESPOSTAS DA API
-- ============================================
--
-- SUCESSO (200):
-- {
--   "success": true,
--   "message": "Transação criada com sucesso",
--   "data": {
--     "id": 123,
--     "tipo": "despesa",
--     "descricao": "CONTA DE ENERGIA ELÉTRICA - REF NOV/2024",
--     "valor": "245.80",
--     "categoria": "Contas",
--     "data_transacao": "2024-11-20",
--     "forma_pagamento": "outro",
--     "data_vencimento": "2024-11-25",
--     "paga": false,
--     "created_at": "2024-11-20T10:30:00.000000Z",
--     "updated_at": "2024-11-20T10:30:00.000000Z"
--   }
-- }
--
-- ERROS COMUNS:
--   - 401: Token inválido ou expirado (verificar Authorization header)
--   - 422: Dados inválidos (validação falhou - verificar campos obrigatórios)
--   - 500: Erro interno do servidor
--
-- EXEMPLO DE ERRO 422:
-- {
--   "message": "The given data was invalid.",
--   "errors": {
--     "tipo": ["O tipo da transação é obrigatório"],
--     "valor": ["O valor deve ser maior que zero"]
--   }
-- }
--
