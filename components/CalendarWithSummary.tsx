import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import { borderRadius, shadows, spacing } from '../styles/theme';
import DespesaFixaDayModal from './DespesaFixaDayModal';
import MonthlyCalendarCard from './MonthlyCalendarCard';
import SummaryChart from './SummaryChart';

interface DespesaFixa {
  id: number;
  dia_vencimento: number;
  descricao: string;
  valor: number;
  categoria?: string | null;
  forma_pagamento?: string;
  cartao?: {
    id: number;
    nome: string;
    ultimos_4_digitos?: string;
  } | null;
  observacao?: string | null;
}

interface MonthlySummary {
  month: string;
  lastUpdated: string;
  profits: number;
  expenses: number;
  positiveBalance: number;
  largestExpenseCategory: string;
}

interface CalendarWithSummaryProps {
  despesasFixas?: DespesaFixa[];
  summary?: MonthlySummary;
}

export default function CalendarWithSummary({ despesasFixas = [], summary: initialSummary }: CalendarWithSummaryProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  const styles = createStyles(colors, isSmallScreen);

  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
  const [summary, setSummary] = useState<MonthlySummary | null>(initialSummary || null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDayDespesas, setSelectedDayDespesas] = useState<DespesaFixa[]>([]);
  const [showDayModal, setShowDayModal] = useState(false);

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    loadSummaryForMonth();
  }, [mesSelecionado, anoSelecionado]);

  const loadSummaryForMonth = async () => {
    try {
      setLoadingSummary(true);
      const response = await apiService.get<{ success: boolean; data?: MonthlySummary }>(
        `/resumo-mensal?mes=${mesSelecionado}&ano=${anoSelecionado}`
      );
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleMonthChange = (month: number, year: number) => {
    setMesSelecionado(month + 1);
    setAnoSelecionado(year);
  };

  const handleDayPress = (day: number, despesas: DespesaFixa[]) => {
    setSelectedDay(day);
    setSelectedDayDespesas(despesas);
    setShowDayModal(true);
  };

  const handleCloseDayModal = () => {
    setShowDayModal(false);
    setSelectedDay(null);
    setSelectedDayDespesas([]);
  };

  const handleMesAnterior = () => {
    let novoMes = mesSelecionado - 1;
    let novoAno = anoSelecionado;
    
    if (novoMes < 1) {
      novoMes = 12;
      novoAno--;
    }
    
    setMesSelecionado(novoMes);
    setAnoSelecionado(novoAno);
  };

  const handleProximoMes = () => {
    let novoMes = mesSelecionado + 1;
    let novoAno = anoSelecionado;
    
    if (novoMes > 12) {
      novoMes = 1;
      novoAno++;
    }
    
    setMesSelecionado(novoMes);
    setAnoSelecionado(novoAno);
  };

  const isMesAtual = mesSelecionado === hoje.getMonth() + 1 && anoSelecionado === hoje.getFullYear();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleMesAnterior}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.monthTitle}>
            {nomesMeses[mesSelecionado - 1]} {anoSelecionado}
          </Text>
          {isMesAtual && (
            <Text style={styles.currentMonthLabel}>Mês atual</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleProximoMes}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.calendarContainer}>
          <MonthlyCalendarCard 
            despesasFixas={despesasFixas} 
            showMonth={false}
            currentMonth={mesSelecionado - 1}
            currentYear={anoSelecionado}
            onMonthChange={handleMonthChange}
            onDayPress={handleDayPress}
          />
        </View>

        {summary && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Resumo Financeiro</Text>
                <TouchableOpacity
                  style={styles.chartToggle}
                  onPress={() => setShowChart(!showChart)}
                >
                  <Ionicons 
                    name={showChart ? 'list' : 'bar-chart'} 
                    size={20} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>
              </View>

              {loadingSummary ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Carregando...</Text>
                </View>
              ) : showChart ? (
                <SummaryChart 
                  profits={summary.profits} 
                  expenses={summary.expenses} 
                />
              ) : (
                <>
                  <View style={styles.summaryItem}>
                    <View style={styles.summaryItemLeft}>
                      <View style={[styles.summaryIcon, { backgroundColor: colors.success + '20' }]}>
                        <Text style={[styles.summaryIconText, { color: colors.success }]}>+</Text>
                      </View>
                      <Text style={styles.summaryLabel}>Receitas</Text>
                    </View>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                      {formatCurrency(summary.profits)}
                    </Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <View style={styles.summaryItemLeft}>
                      <View style={[styles.summaryIcon, { backgroundColor: colors.error + '20' }]}>
                        <Text style={[styles.summaryIconText, { color: colors.error }]}>-</Text>
                      </View>
                      <Text style={styles.summaryLabel}>Despesas</Text>
                    </View>
                    <Text style={[styles.summaryValue, { color: colors.error }]}>
                      {formatCurrency(summary.expenses)}
                    </Text>
                  </View>

                  <View style={styles.summaryDivider} />

                  <View style={styles.summaryItem}>
                    <View style={styles.summaryItemLeft}>
                      <View style={[styles.summaryIcon, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.summaryIconText, { color: colors.primary }]}>=</Text>
                      </View>
                      <Text style={styles.summaryLabel}>Saldo</Text>
                    </View>
                    <Text style={[
                      styles.summaryValue,
                      { color: summary.positiveBalance >= 0 ? colors.success : colors.error }
                    ]}>
                      {formatCurrency(summary.positiveBalance)}
                    </Text>
                  </View>

                  {summary.largestExpenseCategory && summary.largestExpenseCategory !== '-' && (
                    <>
                      <View style={styles.summaryDivider} />
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryLabel}>Maior categoria:</Text>
                        <Text style={styles.categoryValue}>{summary.largestExpenseCategory}</Text>
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        )}
      </View>

      <DespesaFixaDayModal
        visible={showDayModal}
        onClose={handleCloseDayModal}
        day={selectedDay}
        despesas={selectedDayDespesas}
      />
    </View>
  );
}

const createStyles = (colors: any, isSmallScreen: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'capitalize',
  },
  currentMonthLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  calendarContainer: {
    flex: isSmallScreen ? 0 : 1.2,
    width: isSmallScreen ? '100%' : undefined,
  },
  summaryContainer: {
    flex: isSmallScreen ? 0 : 1,
    width: isSmallScreen ? '100%' : undefined,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  chartToggle: {
    padding: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  categoryInfo: {
    marginTop: spacing.xs,
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  categoryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
});
