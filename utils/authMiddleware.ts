import { AuthValidation } from './authValidation';

export class AuthMiddleware {
  static async requireAuth(): Promise<boolean> {
    try {
      const isLoggedIn = await AuthValidation.isLoggedIn();
      if (!isLoggedIn) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error);
      return false;
    }
  }

  static async redirectIfNotAuthenticated(router: any): Promise<void> {
    const isAuthenticated = await this.requireAuth();
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }

  static async redirectIfAuthenticated(router: any): Promise<void> {
    const isAuthenticated = await this.requireAuth();
    if (isAuthenticated) {
      router.replace('/home');
    }
  }
}
