import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface DetailedGoalCardProps {
  goal: {
    id: number;
    type: 'performance' | 'habit';
    title: string;
    icon: string;
    iconColor: string;
    progressType: 'amount' | 'completed' | 'streak' | 'weekly';
    currentAmount?: number;
    targetAmount?: number;
    completed?: boolean;
    description?: string;
    currentStreak?: number;
    weeklyProgress?: boolean[];
    points: number;
  };
  onPress?: () => void;
}

export default function DetailedGoalCard({ goal, onPress }: DetailedGoalCardProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  const getProgressPercentage = () => {
    if (goal.progressType === 'amount' && goal.currentAmount && goal.targetAmount) {
      return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    }
    if (goal.progressType === 'completed') {
      return goal.completed ? 100 : 0;
    }
    if (goal.progressType === 'streak' && goal.currentStreak) {
      return Math.min((goal.currentStreak / 30) * 100, 100);
    }
    if (goal.progressType === 'weekly' && goal.weeklyProgress) {
      const completedDays = goal.weeklyProgress.filter(day => day).length;
      return (completedDays / 7) * 100;
    }
    return 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProgressText = () => {
    switch (goal.progressType) {
      case 'amount':
        return `${formatCurrency(goal.currentAmount || 0)} de ${formatCurrency(goal.targetAmount || 0)}`;
      case 'completed':
        return goal.completed ? 'Concluída!' : 'Em andamento';
      case 'streak':
        return `${goal.currentStreak || 0} dias consecutivos`;
      case 'weekly':
        const completedDays = goal.weeklyProgress?.filter(day => day).length || 0;
        return `${completedDays}/7 dias esta semana`;
      default:
        return 'Em progresso';
    }
  };

  const getProgressIcon = () => {
    switch (goal.progressType) {
      case 'amount':
        return 'trending-up';
      case 'completed':
        return goal.completed ? 'checkmark-circle' : 'time';
      case 'streak':
        return 'flame';
      case 'weekly':
        return 'calendar';
      default:
        return 'flag';
    }
  };

  const progressPercentage = getProgressPercentage();
  const progressText = getProgressText();
  const progressIcon = getProgressIcon();

  return (
    <TouchableOpacity 
      style={[styles.goalCard, goal.completed && styles.goalCardCompleted]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleContainer}>
          <View style={styles.goalIconContainer}>
            <Ionicons name={goal.icon as any} size={24} color={goal.iconColor} />
          </View>
          <View style={styles.goalTitleText}>
            <Text style={[styles.goalTitle, goal.completed && styles.goalTitleCompleted]}>
              {goal.title}
            </Text>
            <Text style={styles.goalType}>
              {goal.type === 'performance' ? 'Meta de Performance' : 'Meta de Hábito'}
            </Text>
          </View>
        </View>
        
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{goal.points} pts</Text>
        </View>
      </View>

      {goal.description && (
        <Text style={[styles.goalDescription, goal.completed && styles.goalDescriptionCompleted]}>
          {goal.description}
        </Text>
      )}

      <View style={styles.goalProgress}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progresso</Text>
          <Text style={styles.progressPercentage}>{progressPercentage.toFixed(0)}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: goal.completed ? colors.success : colors.primary
              }
            ]} 
          />
        </View>
        
        <View style={styles.progressDetails}>
          <View style={styles.progressInfo}>
            <Ionicons name={progressIcon as any} size={14} color={colors.textSecondary} />
            <Text style={styles.progressText}>{progressText}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
