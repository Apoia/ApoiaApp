import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface SettingItemProps {
  setting: {
    id: number;
    title: string;
    description: string;
    icon: string;
    type: 'toggle' | 'navigation';
    value?: boolean;
  };
  onToggle?: (id: number) => void;
  onPress?: (id: number) => void;
}

export default function SettingItem({ setting, onToggle, onPress }: SettingItemProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  const handlePress = () => {
    if (setting.type === 'toggle' && onToggle) {
      onToggle(setting.id);
    } else if (setting.type === 'navigation' && onPress) {
      onPress(setting.id);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={handlePress}
      disabled={setting.type === 'toggle'}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={setting.icon as any} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
      {setting.type === 'toggle' ? (
        <Switch
          value={setting.value}
          onValueChange={() => onToggle?.(setting.id)}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={setting.value ? colors.primary : colors.textSecondary}
        />
      ) : (
        <View style={styles.settingAction}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      )}
    </TouchableOpacity>
  );
}