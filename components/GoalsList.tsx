import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

interface GoalsListProps {
  goals: Goal[];
}

export default function GoalsList({ goals }: GoalsListProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Minhas Metas</Text>
        <View style={styles.summaryIcon}>
          <Ionicons name="flag" size={24} color={colors.warning} />
        </View>
      </View>
      
      <ScrollView 
        style={styles.goalsList}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {goals.map((goal) => (
          <TouchableOpacity key={goal.id} style={styles.goalCard}>
            <View style={styles.goalCardContainer}>
              <View style={styles.goalCardHeader}>
                <View style={[styles.goalCardIconContainer, { backgroundColor: goal.color + '20' }]}>
                  <Ionicons name={goal.icon as any} size={24} color={goal.color} />
                </View>
                <View style={styles.goalCardInfo}>
                  <Text style={styles.goalCardTitle}>{goal.title}</Text>
                  <Text style={styles.goalCardDescription}>{goal.description}</Text>
                </View>
              </View>
              
              <View style={styles.goalCardProgress}>
                <View style={styles.goalCardProgressHeader}>
                  <Text style={styles.goalCardProgressLabel}>Progresso</Text>
                  <Text style={styles.goalCardProgressValue}>
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </Text>
                </View>
                <View style={styles.goalCardProgressBar}>
                  <View 
                    style={[
                      styles.goalCardProgressFill,
                      { 
                        width: `${goal.progress}%`,
                        backgroundColor: goal.color
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}