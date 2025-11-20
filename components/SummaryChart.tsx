import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { borderRadius, spacing } from '../styles/theme';

interface SummaryChartProps {
  profits: number;
  expenses: number;
}

export default function SummaryChart({ profits, expenses }: SummaryChartProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const total = profits + expenses;
  const profitsPercentage = total > 0 ? (profits / total) * 100 : 0;
  const expensesPercentage = total > 0 ? (expenses / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.barContainer}>
          <View style={styles.barWrapper}>
            <View style={[styles.bar, styles.profitBar, { height: `${Math.max(profitsPercentage, 5)}%` }]} />
            <Text style={styles.barLabel}>Receitas</Text>
          </View>
          
          <View style={styles.barWrapper}>
            <View style={[styles.bar, styles.expenseBar, { height: `${Math.max(expensesPercentage, 5)}%` }]} />
            <Text style={styles.barLabel}>Despesas</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>
            {profitsPercentage.toFixed(1)}% Receitas
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>
            {expensesPercentage.toFixed(1)}% Despesas
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  chartContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
    gap: spacing.lg,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: borderRadius.sm,
    minHeight: 8,
  },
  profitBar: {
    backgroundColor: colors.success,
  },
  expenseBar: {
    backgroundColor: colors.error,
  },
  barLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

