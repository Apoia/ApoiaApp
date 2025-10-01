import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface ProfileStatsCardProps {
  stats: {
    totalSaved: number;
    totalInvested: number;
    debtPaid: number;
    monthlyBudget: number;
  };
}

export default function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Estatísticas Financeiras</Text>
        <View style={styles.statsIcon}>
          <Ionicons name="bar-chart" size={24} color={colors.info} />
        </View>
      </View>
      
      <View style={styles.statsContent}>
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="wallet" size={24} color={colors.success} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Total Poupança</Text>
            <Text style={styles.statValue}>{formatCurrency(stats.totalSaved)}</Text>
            <Text style={styles.statDescription}>Valor acumulado em poupança</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="trending-up" size={24} color={colors.primary} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Total Investido</Text>
            <Text style={styles.statValue}>{formatCurrency(stats.totalInvested)}</Text>
            <Text style={styles.statDescription}>Valor em investimentos</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="card" size={24} color={colors.warning} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Dívidas Pagas</Text>
            <Text style={styles.statValue}>{formatCurrency(stats.debtPaid)}</Text>
            <Text style={styles.statDescription}>Valor pago em dívidas</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name="calendar" size={24} color={colors.accent} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Orçamento Mensal</Text>
            <Text style={styles.statValue}>{formatCurrency(stats.monthlyBudget)}</Text>
            <Text style={styles.statDescription}>Limite mensal de gastos</Text>
          </View>
        </View>
      </View>
    </View>
  );
}