import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface Goal {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  targetAmount: number;
  currentAmount: number;
}

interface IndividualGoalCardProps {
  goal: Goal;
  onPress?: () => void;
}

export default function IndividualGoalCard({ goal, onPress }: IndividualGoalCardProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const progressPercentage = Math.round(goal.progress * 100);

  return (
    <TouchableOpacity style={styles.individualGoalCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.individualGoalHeader}>
        <View style={[styles.individualGoalIcon, { backgroundColor: goal.color + '20' }]}>
          <Text style={styles.individualGoalEmoji}>{goal.icon}</Text>
        </View>
        <View style={styles.individualGoalInfo}>
          <Text style={styles.individualGoalTitle}>{goal.title}</Text>
          <Text style={styles.individualGoalDescription}>{goal.description}</Text>
        </View>
        <Text style={styles.individualGoalProgress}>{progressPercentage}%</Text>
      </View>
      
      <View style={styles.individualGoalProgressContainer}>
        <View style={styles.individualGoalProgressBar}>
          <View 
            style={[
              styles.individualGoalProgressFill,
              { 
                width: `${progressPercentage}%`,
                backgroundColor: goal.color
              }
            ]} 
          />
        </View>
        <View style={styles.individualGoalAmounts}>
          <Text style={styles.individualGoalCurrent}>
            {formatCurrency(goal.currentAmount)}
          </Text>
          <Text style={styles.individualGoalTarget}>
            / {formatCurrency(goal.targetAmount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
