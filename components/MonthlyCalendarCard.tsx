import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { borderRadius, shadows, spacing } from '../styles/theme';

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

interface MonthlyCalendarCardProps {
  despesasFixas?: DespesaFixa[];
  showMonth?: boolean;
  currentMonth?: number;
  currentYear?: number;
  onMonthChange?: (month: number, year: number) => void;
  onDayPress?: (day: number, despesas: DespesaFixa[]) => void;
}

export default function MonthlyCalendarCard({ 
  despesasFixas = [], 
  showMonth = true,
  currentMonth,
  currentYear,
  onMonthChange,
  onDayPress
}: MonthlyCalendarCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(currentMonth ?? hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(currentYear ?? hoje.getFullYear());

  useEffect(() => {
    if (currentMonth !== undefined) {
      setMesSelecionado(currentMonth);
    }
    if (currentYear !== undefined) {
      setAnoSelecionado(currentYear);
    }
  }, [currentMonth, currentYear]);

  const mesAtual = mesSelecionado;
  const anoAtual = anoSelecionado;
  const diaAtual = hoje.getDate();
  const mesAtualHoje = hoje.getMonth();
  const anoAtualHoje = hoje.getFullYear();
  
  const isMesAtual = mesAtual === mesAtualHoje && anoAtual === anoAtualHoje;

  const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay();
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const despesasPorDia = useMemo(() => {
    const mapa: { [key: number]: DespesaFixa[] } = {};
    despesasFixas.forEach(despesa => {
      if (!mapa[despesa.dia_vencimento]) {
        mapa[despesa.dia_vencimento] = [];
      }
      mapa[despesa.dia_vencimento].push(despesa);
    });
    return mapa;
  }, [despesasFixas]);

  const dias = useMemo(() => {
    const array: (number | null)[] = [];
    
    for (let i = 0; i < primeiroDiaDoMes; i++) {
      array.push(null);
    }
    
    for (let dia = 1; dia <= diasNoMes; dia++) {
      array.push(dia);
    }
    
    return array;
  }, [primeiroDiaDoMes, diasNoMes]);

  const handleMesAnterior = () => {
    let novoMes = mesSelecionado - 1;
    let novoAno = anoSelecionado;
    
    if (novoMes < 0) {
      novoMes = 11;
      novoAno--;
    }
    
    setMesSelecionado(novoMes);
    setAnoSelecionado(novoAno);
    onMonthChange?.(novoMes, novoAno);
  };

  const handleProximoMes = () => {
    let novoMes = mesSelecionado + 1;
    let novoAno = anoSelecionado;
    
    if (novoMes > 11) {
      novoMes = 0;
      novoAno++;
    }
    
    setMesSelecionado(novoMes);
    setAnoSelecionado(novoAno);
    onMonthChange?.(novoMes, novoAno);
  };

  return (
    <View style={styles.container}>
      {showMonth && (
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
              {nomesMeses[mesAtual]} {anoAtual}
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
      )}

      <View style={styles.weekDays}>
        {diasSemana.map((dia, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{dia}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {dias.map((dia, index) => {
          if (dia === null) {
            return <View key={index} style={styles.dayCell} />;
          }

          const temDespesa = despesasPorDia[dia] && despesasPorDia[dia].length > 0;
          const isToday = isMesAtual && dia === diaAtual && anoAtual === anoAtualHoje;
          const isPast = !isMesAtual || (isMesAtual && dia < diaAtual);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isToday && styles.todayCell,
              ]}
              onPress={() => {
                if (temDespesa && onDayPress) {
                  onDayPress(dia, despesasPorDia[dia]);
                }
              }}
              activeOpacity={temDespesa ? 0.7 : 1}
              disabled={!temDespesa}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isToday && styles.todayNumber,
                  isPast && !isToday && styles.pastDay,
                ]}
              >
                {dia}
              </Text>
              {temDespesa && (
                <View style={[
                  styles.marker,
                  isToday && styles.markerToday,
                  isPast && !isToday && styles.markerPast,
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {despesasFixas.length > 0 && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Despesa fixa</Text>
          </View>
          {isMesAtual && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.todayDot, { borderColor: colors.primary }]} />
              <Text style={styles.legendText}>Hoje</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  currentMonthLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: spacing.xs,
  },
  todayCell: {
    backgroundColor: colors.primary + '15',
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  todayNumber: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  pastDay: {
    color: colors.textSecondary,
    opacity: 0.5,
  },
  marker: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  markerToday: {
    backgroundColor: colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  markerPast: {
    backgroundColor: colors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  todayDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
