import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { borderRadius, spacing } from '../styles/theme';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AboutModal({ visible, onClose }: AboutModalProps) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 500;
  const modalWidth = isSmallScreen ? width - 32 : Math.min(550, width - 64);
  const modalHeight = height * 0.75;
  const styles = createStyles(colors, modalWidth, modalHeight, isSmallScreen);

  const features = [
    {
      icon: 'wallet',
      title: 'Controle Financeiro',
      description: 'Gerencie receitas e despesas'
    },
    {
      icon: 'calendar',
      title: 'Despesas Fixas',
      description: 'Lembretes automáticos'
    },
    {
      icon: 'trophy',
      title: 'Gamificação',
      description: 'Pontos e conquistas'
    },
    {
      icon: 'flag',
      title: 'Metas',
      description: 'Acompanhe seus objetivos'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.heroSection}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>Apoia</Text>
              <Text style={styles.tagline}>Sua educação financeira em suas mãos</Text>
            </View>

            <View style={styles.descriptionCard}>
              <Text style={styles.description}>
                Transforme sua relação com o dinheiro através de uma plataforma completa 
                que combina controle financeiro inteligente, gamificação e educação.
              </Text>
            </View>

            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name={feature.icon as any} size={24} color={colors.primary} />
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>

            <View style={styles.footer}>
              <View style={styles.versionRow}>
                <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
                <Text style={styles.versionText}>Versão 1.0.0</Text>
              </View>
              <View style={styles.footerRow}>
                <Ionicons name="heart" size={14} color={colors.error} />
                <Text style={styles.footerText}>
                  Desenvolvido com dedicação para sua liberdade financeira
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any, modalWidth: number, modalHeight: number, isSmallScreen: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: modalWidth,
    height: modalHeight,
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border + '30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: spacing.xs,
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  descriptionCard: {
    backgroundColor: colors.primary + '08',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '15',
  },
  description: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  featureItem: {
    width: isSmallScreen ? '48%' : '48%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 90,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: 2,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  footer: {
    gap: spacing.xs,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  versionText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
});
