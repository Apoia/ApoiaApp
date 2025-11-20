// Configuração da API
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.97:8001/api' // Desenvolvimento local - use o IP da sua máquina
  : 'https://sua-api-producao.com/api' // Produção

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000
}

export default API_CONFIG
