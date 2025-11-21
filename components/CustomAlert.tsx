import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { borderRadius, shadows, spacing } from '../styles/theme';

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
}

export default function CustomAlert({ visible, type, title, message, onClose }: CustomAlertProps) {
  const { colors, isDarkMode } = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: colors.success || '#10B981' };
      case 'error':
        return { name: 'close-circle', color: colors.error || '#EF4444' };
      case 'warning':
        return { name: 'warning', color: colors.warning || '#F59E0B' };
    }
  };

  const icon = getIcon();

  const styles = createStyles(colors, isDarkMode, icon.color);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon.name as any} size={64} color={icon.color} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any, isDarkMode: boolean, iconColor: string) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border + '40',
  },
  iconContainer: {
    marginBottom: spacing.lg,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: iconColor + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  button: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 140,
    backgroundColor: iconColor,
    ...shadows.medium,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});