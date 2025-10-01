import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import mockData from '../data/mockData.json';
import { createNavigationStyles } from '../styles/NavigationStyles';
import BottomNavigation from './BottomNavigation';

interface GlobalNavigationProps {
  children: React.ReactNode;
}

export default function GlobalNavigation({ children }: GlobalNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();
  const styles = createNavigationStyles(colors);
  
  const [navigationItems, setNavigationItems] = useState(
    mockData.navigation.map(item => ({
      ...item,
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
      mockData.navigation.map(item => ({
        ...item,
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
        if (pathname !== '/social') {
          router.push('/social');
        }
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

  
  const shouldShowNavigation = !['/login', '/register', '/'].includes(pathname);

  return (
    <View style={styles.container}>
      {children}
      {shouldShowNavigation && (
        <BottomNavigation
          items={navigationItems}
          onItemPress={handleNavigationPress}
        />
      )}
    </View>
  );
}
