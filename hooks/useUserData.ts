import { useEffect, useState } from 'react';
import mockData from '../data/mockData.json';
import { AuthValidation } from '../utils/authValidation';

export interface AppUserData {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
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
        const appUserData: AppUserData = {
          ...authData,
          ...mockData.user,
          name: authData.name,
        };
        setUserData(appUserData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
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


