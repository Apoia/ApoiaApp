import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import GoalCard from '../components/GoalCard';
import { useTheme } from '../contexts/ThemeContext';
import mockData from '../data/mockData.json';
import { createGoalsStyles } from '../styles/GoalsStyles';

export default function GoalsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createGoalsStyles(colors);

  const handleAddGoal = () => {
    
    console.log('Adicionar nova meta');
  };

  const handleBack = () => {
    router.back();
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('pt-BR').format(points);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Melhorado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Metas e Conquistas</Text>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsBadge}>
              <Ionicons name="trophy" size={18} color="#F59E0B" />
              <Text style={styles.pointsText}>{formatPoints(mockData.detailedGoals.totalPoints)} pts</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Conteúdo Principal */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Seção de Boas-vindas */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Continue assim! 🎯</Text>
          <Text style={styles.welcomeSubtitle}>
            Você está no caminho certo para alcançar suas metas financeiras
          </Text>
        </View>

        {/* Seção Suas Metas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Suas Metas</Text>
              <Text style={styles.sectionSubtitle}>
                {mockData.detailedGoals.performanceGoals.length + mockData.detailedGoals.habitGoals.length} metas ativas
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Metas de Performance */}
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
              {mockData.detailedGoals.performanceGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </View>
          </View>

          {/* Metas de Hábito */}
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
              {mockData.detailedGoals.habitGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </View>
          </View>
        </View>

        {/* Seção de Motivação */}
        <View style={styles.motivationSection}>
          <View style={styles.motivationCard}>
            <Ionicons name="bulb" size={32} color="#F59E0B" />
            <Text style={styles.motivationTitle}>Dica do Dia</Text>
            <Text style={styles.motivationText}>
              Pequenos hábitos diários podem gerar grandes mudanças na sua vida financeira!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
