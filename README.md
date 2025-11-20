# ApoiaApp - Frontend

Aplicativo mobile de educação financeira gamificada desenvolvido com React Native (Expo).

## 📱 Sobre o Projeto

O ApoiaApp é uma plataforma completa que combina controle financeiro inteligente, gamificação e educação para transformar a relação dos usuários com o dinheiro.

### Funcionalidades Principais

- **Controle Financeiro**: Gerencie receitas e despesas de forma simples e intuitiva
- **Despesas Fixas**: Sistema de lembretes automáticos para contas recorrentes com alertas de vencimento
- **Gamificação**: Ganhe pontos e conquistas mantendo suas finanças em dia
- **Metas Financeiras**: Defina e acompanhe suas metas de economia com diferentes tipos de progresso
- **Cartões**: Gerencie seus cartões de crédito e débito
- **Resumo Mensal**: Visualize seus ganhos, gastos e saldo do mês

## 🛠️ Tecnologias

- **React Native** com Expo
- **TypeScript**
- **Expo Router** para navegação baseada em arquivos
- **Context API** para gerenciamento de estado
- **AsyncStorage** para persistência local (tokens, categorias customizadas)
- **Ionicons** para ícones

## 📁 Estrutura do Projeto

```
ApoiaApp/
├── app/                    # Telas do aplicativo (Expo Router)
│   ├── index.tsx          # Splash screen
│   ├── login.tsx          # Tela de login
│   ├── register.tsx       # Tela de registro
│   ├── home.tsx           # Tela inicial
│   ├── add-despesa.tsx    # Cadastro de despesa
│   ├── add-receita.tsx    # Cadastro de receita
│   ├── profile.tsx        # Perfil do usuário
│   └── ...
├── components/             # Componentes reutilizáveis
│   ├── AboutModal.tsx
│   ├── CartaoModal.tsx
│   ├── CustomAlert.tsx
│   └── ...
├── contexts/              # Contextos React
│   └── ThemeContext.tsx   # Gerenciamento de tema
├── styles/                # Estilos e temas
│   ├── theme.ts           # Cores, espaçamentos, etc
│   └── ...
├── utils/                 # Utilitários e serviços
│   ├── apiService.ts      # Serviço de requisições HTTP
│   ├── apiConfig.ts       # Configuração da URL da API
│   ├── authValidation.ts  # Lógica de autenticação
│   └── masks.ts           # Máscaras de formatação (moeda, data)
├── assets/                 # Imagens e recursos
│   └── images/
└── schema.sql             # Esquema do banco de dados (referência)
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+ e npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Dispositivo físico ou emulador (Android/iOS)

### Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure a URL da API em `utils/apiConfig.ts`:

```typescript
export const API_BASE_URL = 'http://SEU_IP:8001/api'
```

**Importante**: Substitua `SEU_IP` pelo IP da sua máquina na rede local (não use `localhost` ou `127.0.0.1`).

3. Inicie o aplicativo:

```bash
npx expo start
```

4. Escaneie o QR code com:
   - **Android**: Expo Go app
   - **iOS**: Câmera nativa

## 🔐 Credenciais de Teste

- **Email**: gabrielcordeirobarroso@gmail.com
- **Senha**: Gc123007987?

## 📝 Cadastro de Despesa

Para cadastrar uma despesa, você precisa preencher os seguintes campos:

### Campos Obrigatórios

1. **Descrição** (`descricao`)

   - Texto livre (máximo 200 caracteres)
   - Exemplo: "Compra no supermercado"

2. **Valor** (`valor`)

   - Valor numérico maior que 0
   - Formato: moeda brasileira (R$)
   - Exemplo: R$ 150,00

3. **Data da Transação** (`data_transacao`)

   - Formato: DD/MM/YYYY
   - Exemplo: 20/11/2024

4. **Forma de Pagamento** (`forma_pagamento`)
   - Opções: `dinheiro`, `pix`, `debito`, `credito`, `outro`
   - **Importante**: Se escolher `credito` ou `debito`, é necessário selecionar um cartão cadastrado

### Campos Opcionais

5. **Categoria** (`categoria`)

   - Pode escolher uma categoria pré-definida ou criar uma nova
   - Categorias disponíveis: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, etc.
   - Opção "Outros..." permite criar categoria personalizada

6. **Data de Vencimento** (`data_vencimento`)

   - Formato: DD/MM/YYYY
   - Se não preenchida, usa a data da transação

7. **Status de Pagamento** (`paga`)

   - Checkbox para marcar se já foi paga
   - Se marcada, pode preencher a data de pagamento

8. **Data de Pagamento** (`data_pagamento`)

   - Formato: DD/MM/YYYY
   - Só aparece se "Já foi paga" estiver marcado

9. **Observação** (`observacao`)

   - Texto livre para notas adicionais

10. **Cartão** (`cartao_id`)
    - Obrigatório apenas se forma de pagamento for `credito` ou `debito`
    - Se não houver cartões cadastrados, aparece um modal para cadastrar
    - Se houver cartões, aparece um dropdown para seleção

### Fluxo de Cadastro

1. Acesse a tela "Adicionar" e selecione "Despesa"
2. Preencha os campos obrigatórios
3. Se escolher cartão de crédito/débito:
   - Se não tiver cartões: modal aparece para cadastrar
   - Se tiver cartões: selecione no dropdown
4. Opcionalmente, preencha categoria, data de vencimento, etc.
5. Clique em "Salvar Despesa"

### Validações

- Descrição não pode estar vazia
- Valor deve ser maior que 0
- Data da transação deve estar no formato correto
- Se forma de pagamento for crédito/débito, cartão é obrigatório
- Data de pagamento só é aceita se "paga" estiver marcado

### Exemplo de Payload Enviado

```json
{
  "tipo": "despesa",
  "descricao": "Compra no supermercado",
  "valor": 150.0,
  "categoria": "Alimentação",
  "data_transacao": "2024-11-20",
  "forma_pagamento": "debito",
  "data_vencimento": "2024-11-20",
  "paga": true,
  "data_pagamento": "2024-11-20",
  "observacao": "Compras do mês",
  "cartao_id": 1
}
```

## 🔧 Configuração da API

O aplicativo se comunica com a API Laravel através do arquivo `utils/apiService.ts`.

A URL base é configurada em `utils/apiConfig.ts`:

```typescript
export const API_BASE_URL = 'http://192.168.1.100:8001/api'
```

**Importante**:

- Use o IP da sua máquina na rede local
- A porta padrão é `8001`
- Certifique-se de que a API está rodando e acessível

## 📄 Licença

Este projeto é privado e de uso exclusivo.
