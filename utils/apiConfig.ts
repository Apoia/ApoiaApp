// Configuração da API
// Se estiver usando USB (Android), use localhost via reverse proxy
// Se estiver usando Wi-Fi, use o IP da máquina
const getBaseURL = () => {
  if (__DEV__) {
    // Em desenvolvimento, tenta usar localhost primeiro (USB)
    // Se não funcionar, o app pode tentar o IP da rede
    // Para Android via USB, use: adb reverse tcp:8001 tcp:8001
    return 'http://localhost:8001/api'
    // Alternativa para Wi-Fi: 'http://192.168.1.25:8001/api'
  }
  return 'https://sua-api-producao.com/api' // Produção
}

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000, // 30 segundos para dar mais tempo
  // IP alternativo para Wi-Fi (caso localhost não funcione)
  FALLBACK_URL: 'http://192.168.1.25:8001/api'
}

export default API_CONFIG
