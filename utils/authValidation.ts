import AsyncStorage from '@react-native-async-storage/async-storage'
import apiService from './apiService'

export interface UserCredentials {
  email: string
  password: string
  name?: string
}

export class AuthValidation {
  private static readonly USERS_KEY = 'registeredUsers'
  private static readonly CURRENT_USER_KEY = 'currentUser'
  private static readonly TOKEN_KEY = 'auth_token'

  static async registerUser(
    userData: UserCredentials
  ): Promise<{ success: boolean; message: string }> {
    try {
      const existingUsers = await this.getRegisteredUsers()

      const userExists = existingUsers.some((user) => user.email === userData.email)
      if (userExists) {
        return { success: false, message: 'Este email já está cadastrado' }
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString()
      }

      existingUsers.push(newUser)
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(existingUsers))

      return { success: true, message: 'Usuário cadastrado com sucesso' }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      return { success: false, message: 'Erro interno do sistema' }
    }
  }

  static async validateLogin(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      await AsyncStorage.removeItem(this.TOKEN_KEY)
      await AsyncStorage.removeItem(this.CURRENT_USER_KEY)
      await AsyncStorage.removeItem('isLoggedIn')

      const response = await apiService.post<{
        success: boolean
        message?: string
        data?: { token: string; user: any }
      }>('/login', {
        email,
        password
      })

      if (response.success && response.data) {
        await AsyncStorage.setItem(this.TOKEN_KEY, response.data.token)
        await this.setCurrentUser(response.data.user)
        return {
          success: true,
          message: response.message || 'Login realizado com sucesso',
          user: response.data.user
        }
      }

      return { success: false, message: response.message || 'Erro ao fazer login' }
    } catch (error: any) {
      await AsyncStorage.removeItem(this.TOKEN_KEY)
      await AsyncStorage.removeItem(this.CURRENT_USER_KEY)
      await AsyncStorage.removeItem('isLoggedIn')

      const message =
        error.response?.data?.message || error.message || 'Erro ao conectar com o servidor'
      return { success: false, message }
    }
  }

  static async getRegisteredUsers(): Promise<UserCredentials[]> {
    try {
      const usersString = await AsyncStorage.getItem(this.USERS_KEY)
      return usersString ? JSON.parse(usersString) : []
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return []
    }
  }

  static async getCurrentUser(): Promise<any | null> {
    try {
      const userString = await AsyncStorage.getItem(this.CURRENT_USER_KEY)
      return userString ? JSON.parse(userString) : null
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error)
      return null
    }
  }

  static async setCurrentUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
      await AsyncStorage.setItem('isLoggedIn', 'true')
    } catch (error) {
      console.error('Erro ao salvar usuário atual:', error)
      throw error
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY)

      if (token) {
        try {
          await apiService.post('/logout')
        } catch (error) {}
      }

      await AsyncStorage.removeItem(this.CURRENT_USER_KEY)
      await AsyncStorage.removeItem(this.TOKEN_KEY)
      await AsyncStorage.removeItem('isLoggedIn')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      throw error
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY)
      const currentUser = await this.getCurrentUser()
      return token !== null && currentUser !== null
    } catch (error) {
      console.error('Erro ao verificar status de login:', error)
      return false
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY)
    } catch (error) {
      console.error('Erro ao buscar token:', error)
      return null
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.error('Erro ao limpar dados:', error)
      throw error
    }
  }
}
