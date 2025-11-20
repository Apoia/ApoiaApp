import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createNavigationStyles } from '../styles/NavigationStyles';

interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  active?: boolean;
}

interface BottomNavigationProps {
  items: NavigationItem[];
  onItemPress: (itemId: string) => void;
}

export default function BottomNavigation({ items, onItemPress }: BottomNavigationProps) {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const styles = createNavigationStyles(colors);
  
  
  const iconSize = width < 400 ? 22 : 24;
  const fontSize = width < 400 ? 11 : 12;
  const getIconName = (iconType: string, isActive: boolean) => {
    switch (iconType) {
      case 'home':
        return isActive ? 'home' : 'home-outline';
      case 'plus':
        return isActive ? 'add-circle' : 'add-circle-outline';
      case 'trophy':
        return isActive ? 'trophy' : 'trophy-outline';
      case 'users':
        return isActive ? 'people' : 'people-outline';
      case 'user':
        return isActive ? 'person' : 'person-outline';
      default:
        return 'circle-outline';
    }
  };

  return (
    <View style={styles.navigationContainer}>
      <View style={styles.tabList}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.tabItem}
            onPress={() => onItemPress(item.id)}
            activeOpacity={0.6}
          >
            <View style={styles.tabIcon}>
              <Ionicons
                name={getIconName(item.icon, item.active || false) as any}
                size={iconSize}
                color={item.active ? colors.primary : colors.textSecondary}
              />
            </View>
            <Text 
              style={[
                styles.tabLabel,
                { fontSize },
                item.active ? styles.tabLabelActive : styles.tabLabelInactive
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

