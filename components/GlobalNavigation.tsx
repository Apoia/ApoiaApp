import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import FeatureUnavailableModal from './FeatureUnavailableModal';
import { createNavigationStyles } from '../styles/NavigationStyles';
import BottomNavigation from './BottomNavigation';

interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  active?: boolean;
}

interface GlobalNavigationProps {
  children: React.ReactNode;
}

const navigationItemsData: NavigationItem[] = [
  { id: 'home', title: 'Início', icon: 'home' },
  { id: 'add', title: 'Adicionar', icon: 'plus' },
  { id: 'goals', title: 'Metas', icon: 'trophy' },
  { id: 'social', title: 'Social', icon: 'users' },
  { id: 'profile', title: 'Perfil', icon: 'user' },
];

export default function GlobalNavigation({ children }: GlobalNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();
  const styles = createNavigationStyles(colors);
  
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [navigationItems, setNavigationItems] = useState(
    navigationItemsData.map(item => ({
      id: item.id,
      title: item.title,
      icon: item.icon,
      active: item.id === getActiveTab(pathname)
    }))
  );

  function getActiveTab(path: string): string {
    switch (path) {
      case '/home':
        return 'home';
      case '/add':
        return 'add';
      case '/goals':
        return 'goals';
      case '/social':
        return 'social';
      case '/profile':
        return 'profile';
      default:
        return 'home';
    }
  }

  useEffect(() => {
    const activeTab = getActiveTab(pathname);
    setNavigationItems(
      navigationItemsData.map(item => ({
        id: item.id,
        title: item.title,
        icon: item.icon,
        active: item.id === activeTab
      }))
    );
  }, [pathname]);

  const handleNavigationPress = (itemId: string) => {
    switch (itemId) {
      case 'home':
        if (pathname !== '/home') {
          router.push('/home');
        }
        break;
      case 'add':
        if (pathname !== '/add') {
          router.push('/add');
        }
        break;
      case 'goals':
        if (pathname !== '/goals') {
          router.push('/goals');
        }
        break;
      case 'social':
        setShowSocialModal(true);
        break;
      case 'profile':
        if (pathname !== '/profile') {
          router.push('/profile');
        }
        break;
      default:
        break;
    }
  };

  
  const shouldShowNavigation = !['/login', '/register', '/', '/add-despesa', '/edit-profile'].includes(pathname);

  return (
    <View style={styles.container}>
      {children}
      {shouldShowNavigation && (
        <BottomNavigation
          items={navigationItems}
          onItemPress={handleNavigationPress}
        />
      )}
      
      <FeatureUnavailableModal
        visible={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        title="Social Indisponível"
        message="A funcionalidade Social está atualmente indisponível nesta versão, mas já está em andamento a implementação. Em breve você poderá interagir com outros usuários e compartilhar suas conquistas financeiras!"
      />
    </View>
  );
}
