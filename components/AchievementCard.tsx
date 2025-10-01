import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface AchievementCardProps {
  achievement: {
    id: number;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    points: number;
  };
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  return (
    <View style={styles.achievementCard}>
      <View style={[styles.achievementIcon, { 
        backgroundColor: achievement.unlocked ? colors.warning + '20' : colors.textSecondary + '20' 
      }]}>
        <Ionicons 
          name={achievement.icon as any} 
          size={24} 
          color={achievement.unlocked ? colors.warning : colors.textSecondary} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
      </View>
    </View>
  );
}