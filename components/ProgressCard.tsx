import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface ProgressCardProps {
  level: number | null;
  currentXP: number | null;
  maxXP: number | null;
  xpToNextLevel: number | null;
}

export default function ProgressCard({ level, currentXP, maxXP, xpToNextLevel }: ProgressCardProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);
  
  const displayLevel = level ?? 1;
  const displayCurrentXP = currentXP ?? 0;
  const displayMaxXP = maxXP ?? 100;
  const displayXPToNext = xpToNextLevel ?? 100;
  
  const progressPercentage = displayMaxXP > 0 ? (displayCurrentXP / displayMaxXP) * 100 : 0;

  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <View style={styles.progressTitleContainer}>
          <View style={styles.progressIcon}>
            <Ionicons name="trophy" size={28} color={colors.primary} />
          </View>
          <Text style={styles.progressTitle}>Meu Progresso</Text>
        </View>
      </View>
      
      <View style={styles.progressMainContent}>
        <View style={styles.progressLevelContainer}>
          <Text style={styles.progressLevelLabel}>Nível</Text>
          <Text style={styles.progressLevelValue}>
            {level !== null ? displayLevel : '-'}
          </Text>
        </View>
        
        <View style={styles.progressBarSection}>
          <View style={styles.progressBarHeader}>
            <Text style={styles.progressBarLabel}>
              {displayCurrentXP} / {displayMaxXP} XP
            </Text>
            <Text style={styles.progressBarPercentage}>
              {progressPercentage.toFixed(0)}%
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${Math.min(progressPercentage, 100)}%`,
                  backgroundColor: colors.primary
                }
              ]} 
            />
          </View>
          
          {xpToNextLevel !== null && (
            <Text style={styles.progressNextLevel}>
              {displayXPToNext} XP para o próximo nível
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
