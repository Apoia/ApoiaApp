import { useEffect, useState } from 'react';
import apiService from '../utils/apiService';
import { AuthValidation } from '../utils/authValidation';

export interface AppUserData {
  id: string;
  name: string;
  email: string;
  registeredAt?: string;
  profileImage?: string;
  level?: number;
  currentXP?: number;
  maxXP?: number;
  xpToNextLevel?: number;
}

export function useUserData() {
  const [userData, setUserData] = useState<AppUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const authData = await AuthValidation.getCurrentUser();
      if (authData) {
        try {
          const response = await apiService.get<{ success: boolean; data?: any }>('/usuario');
          if (response.success && response.data) {
            const appUserData: AppUserData = {
              id: response.data.id?.toString() || authData.id,
              name: response.data.nome || authData.name,
              email: response.data.email || authData.email,
              registeredAt: response.data.data_cadastro,
              profileImage: response.data.imagem_perfil_url,
            };
            setUserData(appUserData);
          } else {
            setUserData({
              id: authData.id,
              name: authData.name,
              email: authData.email,
            });
          }
        } catch (error) {
          setUserData({
            id: authData.id,
            name: authData.name,
            email: authData.email,
          });
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = async (newData: Partial<AppUserData>) => {
    try {
      if (userData) {
        const updatedData = { ...userData, ...newData };
        await AuthValidation.setCurrentUser(updatedData);
        setUserData(updatedData);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const logout = async () => {
    try {
      await AuthValidation.logout();
      setUserData(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    userData,
    isLoading,
    updateUserData,
    logout,
    loadUserData,
  };
}


