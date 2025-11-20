import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createComponentStyles } from '../styles/ComponentStyles';

interface MonthlySummaryCardProps {
  month: string;
  lastUpdated: string;
  profits: number;
  expenses: number;
  positiveBalance: number;
  largestExpenseCategory: string;
}

export default function MonthlySummaryCard({
  month,
  lastUpdated,
  profits,
  expenses,
  positiveBalance,
  largestExpenseCategory
}: MonthlySummaryCardProps) {
  const { colors } = useTheme();
  const styles = createComponentStyles(colors);

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return '-';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Resumo do Mês</Text>
        <View style={styles.summaryIcon}>
          <Ionicons name="wallet-outline" size={24} color={colors.success} />
        </View>
      </View>
      
      <View style={styles.summaryContent}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Rendas em {month}</Text>
          <Text style={[styles.summaryValue, styles.summaryValuePositive]}>
            {formatCurrency(profits)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Despesas em {month}</Text>
          <Text style={[styles.summaryValue, styles.summaryValueNegative]}>
            {formatCurrency(expenses)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Saldo</Text>
          <Text style={[styles.summaryValue, positiveBalance > 0 ? styles.summaryValuePositive : styles.summaryValueNegative]}>
            {formatCurrency(positiveBalance)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Maior gasto</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {largestExpenseCategory || '-'}
          </Text>
        </View>
        
        <Text style={styles.summaryLabel}>
          Última atualização: {lastUpdated}
        </Text>
      </View>
    </View>
  );
}