import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import GoalsList from '../components/GoalsList';
import MonthlySummaryCard from '../components/MonthlySummaryCard';
import ProgressCard from '../components/ProgressCard';
import { useTheme } from '../contexts/ThemeContext';
import mockData from '../data/mockData.json';
import { createHomeStyles } from '../styles/HomeStyles';

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com perfil */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={styles.headerTitle}>Meu Progresso</Text>
        </View>
      </View>

      {/* Conteúdo principal */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Card de Progresso */}
        <ProgressCard
          level={mockData.user.level}
          currentXP={mockData.user.currentXP}
          maxXP={mockData.user.maxXP}
          xpToNextLevel={mockData.user.xpToNextLevel}
        />

        {/* Resumo Mensal */}
        <MonthlySummaryCard
          month={mockData.monthlySummary.month}
          lastUpdated={mockData.monthlySummary.lastUpdated}
          profits={mockData.monthlySummary.profits}
          expenses={mockData.monthlySummary.expenses}
          positiveBalance={mockData.monthlySummary.positiveBalance}
          largestExpenseCategory={mockData.monthlySummary.largestExpenseCategory}
        />

        {/* Lista de Metas */}
        <GoalsList goals={mockData.goals} />
      </ScrollView>
    </SafeAreaView>
  );
}
