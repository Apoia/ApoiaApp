import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface ProgressCardProps {
  level: number;
  currentXP: number;
  maxXP: number;
  xpToNextLevel: number;
}

export default function ProgressCard({ level, currentXP, maxXP, xpToNextLevel }: ProgressCardProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);
  const progressPercentage = (currentXP / maxXP) * 100;

  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Meu Progresso</Text>
        <View style={styles.progressIcon}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
        </View>
      </View>
      <View style={styles.progressContent}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Nível Atual</Text>
          <Text style={styles.progressValue}>Nível {level}</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>{xpToNextLevel} XP restantes</Text>
        </View>
      </View>
    </View>
  );
}

