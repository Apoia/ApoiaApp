import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface GoalCardProps {
  goal: {
    id: number;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
  };
  onPress?: () => void;
}

export default function GoalCard({ goal, onPress }: GoalCardProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  const getProgressPercentage = () => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const getPriorityIcon = () => {
    switch (goal.priority) {
      case 'high':
        return 'alert-circle';
      case 'medium':
        return 'time';
      case 'low':
        return 'checkmark-circle';
      default:
        return 'flag';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const progressPercentage = getProgressPercentage();
  const priorityColor = getPriorityColor();
  const priorityIcon = getPriorityIcon();

  return (
    <TouchableOpacity 
      style={[styles.goalCard, goal.completed && styles.goalCardCompleted]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleContainer}>
          <Text style={[styles.goalTitle, goal.completed && styles.goalTitleCompleted]}>
            {goal.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
            <Ionicons name={priorityIcon} size={12} color={priorityColor} />
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {goal.priority.toUpperCase()}
            </Text>
          </View>
        </View>
        
        {goal.completed && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
        )}
      </View>

      <Text style={[styles.goalDescription, goal.completed && styles.goalDescriptionCompleted]}>
        {goal.description}
      </Text>

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
        
        <View style={styles.progressAmounts}>
          <Text style={styles.currentAmount}>
            {formatCurrency(goal.currentAmount)}
          </Text>
          <Text style={styles.targetAmount}>
            de {formatCurrency(goal.targetAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.goalFooter}>
        <View style={styles.goalCategory}>
          <Ionicons name="pricetag" size={14} color={colors.textSecondary} />
          <Text style={styles.categoryText}>{goal.category}</Text>
        </View>
        
        <View style={styles.goalDate}>
          <Ionicons name="calendar" size={14} color={colors.textSecondary} />
          <Text style={styles.dateText}>
            Meta: {formatDate(goal.targetDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
