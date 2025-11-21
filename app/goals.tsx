import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DetailedGoalCard from '../components/DetailedGoalCard';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import { createGoalsStyles } from '../styles/GoalsStyles';

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  icon: string;
  type: 'performance' | 'habit';
}

export default function GoalsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createGoalsStyles(colors);

  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [performanceGoals, setPerformanceGoals] = useState<Goal[]>([]);
  const [habitGoals, setHabitGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadGoalsData();
  }, []);

  const loadGoalsData = async () => {
    try {
      setLoading(true);

      try {
        const goalsResponse = await apiService.get<{ success: boolean; data?: { totalPoints?: number; performanceGoals?: Goal[]; habitGoals?: Goal[] } }>('/metas');
        if (goalsResponse.success && goalsResponse.data) {
          setTotalPoints(goalsResponse.data.totalPoints || null);
          setPerformanceGoals(goalsResponse.data.performanceGoals || []);
          setHabitGoals(goalsResponse.data.habitGoals || []);
        }
      } catch (error) {
        setTotalPoints(null);
        setPerformanceGoals([]);
        setHabitGoals([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    router.push('/criar-meta');
  };

  const handleBack = () => {
    router.back();
  };

  const formatPoints = (points: number | null) => {
    if (points === null) return '-';
    return new Intl.NumberFormat('pt-BR').format(points);
  };

  const totalGoals = performanceGoals.length + habitGoals.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Metas e Conquistas</Text>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsBadge}>
              <Ionicons name="trophy" size={16} color="#fff" />
              <Text style={styles.pointsText}>{formatPoints(totalPoints)} pts</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Continue assim! 🎯</Text>
          <Text style={styles.welcomeSubtitle}>
            Você está no caminho certo para alcançar suas metas financeiras
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Suas Metas</Text>
              <Text style={styles.sectionSubtitle}>
                {totalGoals > 0 ? `${totalGoals} metas ativas` : 'Nenhuma meta cadastrada'}
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {totalGoals > 0 ? (
            <>
              {performanceGoals.length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <View style={styles.subsectionIconContainer}>
                      <Ionicons name="trending-up" size={20} color="#059669" />
                    </View>
                    <Text style={styles.subsectionTitle}>Metas de Performance</Text>
                  </View>
                  <Text style={styles.subsectionDescription}>
                    Metas financeiras com valores específicos
                  </Text>
                  
                  <View style={styles.goalsList}>
                    {performanceGoals.map((goal) => (
                      <DetailedGoalCard 
                        key={goal.id} 
                        goal={goal}
                        onPress={() => router.push(`/editar-meta?id=${goal.id}`)}
                      />
                    ))}
                  </View>
                </View>
              )}

              {habitGoals.length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <View style={[styles.subsectionIconContainer, { backgroundColor: '#FEF3C7' }]}>
                      <Ionicons name="repeat" size={20} color="#D97706" />
                    </View>
                    <Text style={styles.subsectionTitle}>Metas de Hábito</Text>
                  </View>
                  <Text style={styles.subsectionDescription}>
                    Hábitos diários para melhorar sua vida financeira
                  </Text>
                  
                  <View style={styles.goalsList}>
                    {habitGoals.map((goal) => (
                      <DetailedGoalCard 
                        key={goal.id} 
                        goal={goal}
                        onPress={() => router.push(`/editar-meta?id=${goal.id}`)}
                      />
                    ))}
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={[styles.welcomeSection, { padding: 20, alignItems: 'center' }]}>
              <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                Metas indisponíveis no momento
              </Text>
            </View>
          )}
        </View>

        <View style={styles.motivationSection}>
          <View style={styles.motivationCard}>
            <View style={styles.motivationHeader}>
              <View style={styles.motivationIconContainer}>
                <Ionicons name="bulb" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.motivationTitle}>Dica do Dia</Text>
            </View>
            <Text style={styles.motivationText}>
              Pequenos hábitos diários podem gerar grandes mudanças na sua vida financeira!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
