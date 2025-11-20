-- ============================================
-- ESQUEMA COMPLETO DO BANCO DE DADOS - APOIAPP
-- ============================================

-- ============================================
-- 1. USUÁRIOS
-- ============================================
CREATE TABLE usuarios (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NULL,
  senha_hash TEXT NOT NULL,
  imagem_perfil_url TEXT NULL,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX usuario_email_idx ON usuarios (LOWER(email));

-- ============================================
-- 2. CARTÕES
-- ============================================
CREATE TABLE cartoes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  nome VARCHAR(80) NOT NULL,
  ultimos_4_digitos VARCHAR(4) NULL,
  bandeira VARCHAR(30) NULL,
  limite_total DECIMAL(12,2) NULL,
  limite_disponivel DECIMAL(12,2) NULL,
  dia_vencimento INT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX cartao_usuario_idx (usuario_id)
);

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
-- EXEMPLO DE PAYLOAD PARA IA:
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
-- NOTAS IMPORTANTES:
--   - O usuario_id é automaticamente obtido do token de autenticação (não precisa enviar)
--   - Se forma_pagamento for 'credito' ou 'debito', o cartao_id se torna obrigatório
--   - Para boletos, geralmente forma_pagamento será 'outro' ou 'pix' (se identificado como PIX)
--   - A data_transacao pode ser a data de emissão do boleto ou a data atual
--   - A data_vencimento é crucial para boletos e deve ser extraída do documento
--
CREATE TABLE transacoes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL COMMENT 'Obtido automaticamente do token de autenticação',
  cartao_id BIGINT UNSIGNED NULL COMMENT 'Obrigatório apenas se forma_pagamento for credito ou debito',
  tipo VARCHAR(20) NOT NULL COMMENT 'receita ou despesa - Para boletos sempre usar "despesa"',
  descricao VARCHAR(200) NOT NULL COMMENT 'OBRIGATÓRIO: Texto extraído do boleto (ex: "CONTA DE LUZ")',
  valor DECIMAL(12,2) NOT NULL COMMENT 'OBRIGATÓRIO: Valor numérico extraído (ex: 150.50) - deve ser > 0',
  categoria VARCHAR(50) NULL COMMENT 'OPCIONAL: Categoria inferida (ex: "Contas", "Energia")',
  data_transacao DATE NOT NULL COMMENT 'OBRIGATÓRIO: Data no formato YYYY-MM-DD (data do boleto ou atual)',
  forma_pagamento VARCHAR(20) NULL COMMENT 'OBRIGATÓRIO para despesas: dinheiro, pix, debito, credito, outro',
  data_vencimento DATE NULL COMMENT 'OPCIONAL mas RECOMENDADO: Data de vencimento do boleto (YYYY-MM-DD)',
  data_pagamento DATE NULL COMMENT 'OPCIONAL: Data de pagamento se paga=true (YYYY-MM-DD)',
  paga BOOLEAN DEFAULT FALSE COMMENT 'OPCIONAL: true se boleto já foi pago, false caso contrário',
  observacao TEXT NULL COMMENT 'OPCIONAL: Código de barras, linha digitável ou outras informações do boleto',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cartao_id) REFERENCES cartoes(id) ON DELETE SET NULL,
  INDEX transacao_usuario_data_idx (usuario_id, data_transacao DESC),
  INDEX transacao_usuario_tipo_idx (usuario_id, tipo)
);

-- ============================================
-- 4. METAS
-- ============================================
CREATE TABLE metas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NULL,
  tipo ENUM('performance', 'habit') NOT NULL,
  icone VARCHAR(50) NULL,
  cor_icone VARCHAR(20) NULL,
  tipo_progresso ENUM('amount', 'completed', 'streak', 'weekly') DEFAULT 'amount',
  valor_atual DECIMAL(12,2) DEFAULT 0,
  valor_meta DECIMAL(12,2) NULL,
  sequencia_atual INT DEFAULT 0,
  concluida BOOLEAN DEFAULT FALSE,
  pontos INT DEFAULT 0,
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX (usuario_id)
);

-- ============================================
-- 5. DESPESAS FIXAS
-- ============================================
CREATE TABLE despesas_fixas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  categoria VARCHAR(50) NULL,
  dia_vencimento INT NOT NULL COMMENT 'Dia do mês (1-31)',
  forma_pagamento VARCHAR(20) DEFAULT 'pix' COMMENT 'dinheiro, pix, debito, credito, outro',
  cartao_id BIGINT UNSIGNED NULL,
  ativa BOOLEAN DEFAULT TRUE,
  observacao TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cartao_id) REFERENCES cartoes(id) ON DELETE SET NULL,
  INDEX (usuario_id),
  INDEX (usuario_id, dia_vencimento)
);

-- ============================================
-- 6. PERFIL DE GAMIFICAÇÃO
-- ============================================
CREATE TABLE perfil_gamificacao (
  usuario_id BIGINT UNSIGNED PRIMARY KEY,
  nivel INT DEFAULT 1,
  experiencia_atual INT DEFAULT 0,
  experiencia_proximo_nivel INT DEFAULT 100,
  pontos_totais INT DEFAULT 0,
  sequencia_dias INT DEFAULT 0,
  data_ultimo_login DATE NULL,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

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
  TRUE,
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
-- ENDPOINT PARA CADASTRAR DESPESA: POST /api/transacoes
-- 
-- AUTENTICAÇÃO: Requer token Bearer no header Authorization
-- Header: Authorization: Bearer {token_do_usuario}
--
-- CAMPOS MÍNIMOS OBRIGATÓRIOS PARA DESPESA:
--   1. tipo: "despesa" (string)
--   2. descricao: Texto extraído do boleto (string, max 200 chars)
--   3. valor: Valor numérico (decimal, min 0.01)
--   4. data_transacao: Data no formato YYYY-MM-DD
--   5. forma_pagamento: "dinheiro", "pix", "debito", "credito" ou "outro"
--
-- CAMPOS RECOMENDADOS PARA BOLETOS:
--   - categoria: Inferir do tipo de boleto (ex: "Contas", "Energia", "Água", "Internet")
--   - data_vencimento: Data de vencimento extraída do boleto
--   - observacao: Código de barras ou linha digitável para referência
--
-- EXEMPLO COMPLETO DE REQUEST:
-- POST /api/transacoes
-- Headers:
--   Authorization: Bearer {token}
--   Content-Type: application/json
-- Body:
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
-- SUGESTÕES DE CATEGORIAS PARA BOLETOS:
--   - "Contas" (genérico)
--   - "Energia" (conta de luz)
--   - "Água" (conta de água)
--   - "Internet" (provedor de internet)
--   - "Telefone" (telefonia)
--   - "TV/Streaming" (TV a cabo, streaming)
--   - "Impostos" (impostos e taxas)
--   - "Seguro" (seguros diversos)
--   - "Financiamento" (parcelas de financiamento)
--   - "Outros" (quando não conseguir identificar)
--
-- VALIDAÇÕES IMPORTANTES:
--   - valor deve ser numérico e maior que 0.01
--   - data_transacao deve estar no formato YYYY-MM-DD válido
--   - forma_pagamento deve ser uma das opções permitidas
--   - Se forma_pagamento for "credito" ou "debito", cartao_id se torna obrigatório
--   - Se paga=true, é recomendado enviar data_pagamento
--
-- RESPOSTA DE SUCESSO (200):
-- {
--   "success": true,
--   "message": "Transação criada com sucesso",
--   "data": {
--     "id": 123,
--     "tipo": "despesa",
--     "descricao": "CONTA DE ENERGIA ELÉTRICA - REF NOV/2024",
--     "valor": "245.80",
--     ...
--   }
-- }
--
-- ERROS COMUNS:
--   - 401: Token inválido ou expirado
--   - 422: Dados inválidos (validação falhou)
--   - 500: Erro interno do servidor
--

