import AsyncStorage from '@react-native-async-storage/async-storage'
import API_CONFIG from './apiConfig'

class ApiService {
  private baseURL: string
  private readonly TOKEN_KEY = 'auth_token'

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY)
    } catch (error) {
      return null
    }
  }

  private isPublicEndpoint(endpoint: string): boolean {
    // Rotas públicas que não precisam de token
    const publicEndpoints = ['/login', '/register', '/test']
    return publicEndpoints.some((publicEndpoint) => endpoint.startsWith(publicEndpoint))
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    // Buscar token de autenticação apenas se não for rota pública
    const isPublic = this.isPublicEndpoint(endpoint)
    const token = isPublic ? null : await this.getAuthToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>)
    }

    // Adicionar token apenas se existir e não for rota pública
    if (token && !isPublic) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const config: RequestInit = {
      ...options,
      headers
    }

    try {
      const response = await fetch(url, config)

      // Se não autorizado em rota protegida, limpar token
      if (response.status === 401 && !isPublic) {
        await AsyncStorage.removeItem(this.TOKEN_KEY)
        await AsyncStorage.removeItem('currentUser')
        await AsyncStorage.removeItem('isLoggedIn')
        throw new Error('Sessão expirada. Faça login novamente.')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`)
        ;(error as any).response = { data: errorData, status: response.status }
        throw error
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiService = new ApiService()
export default apiService
