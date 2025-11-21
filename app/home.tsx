import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import CalendarWithSummary from '../components/CalendarWithSummary';
import DespesaFixaAlertModal from '../components/DespesaFixaAlertModal';
import IndividualGoalCard from '../components/IndividualGoalCard';
import ProgressCard from '../components/ProgressCard';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import { createHomeStyles } from '../styles/HomeStyles';

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  icon: string;
  color?: string;
  currentAmount?: number;
  targetAmount?: number;
}

interface MonthlySummary {
  month: string;
  lastUpdated: string;
  profits: number;
  expenses: number;
  positiveBalance: number;
  largestExpenseCategory: string;
}

interface GamificationData {
  level: number;
  currentXP: number;
  maxXP: number;
  xpToNextLevel: number;
}

interface DespesaFixa {
  id: number;
  descricao: string;
  valor: number;
  dia_vencimento: number;
  categoria?: string | null;
  forma_pagamento?: string;
  cartao?: {
    id: number;
    nome: string;
    ultimos_4_digitos?: string;
  } | null;
  observacao?: string | null;
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  const [loading, setLoading] = useState(true);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [despesaFixaAlert, setDespesaFixaAlert] = useState<DespesaFixa | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isDespesaVencida, setIsDespesaVencida] = useState(false);
  const [despesasFixas, setDespesasFixas] = useState<DespesaFixa[]>([]);

  const loadHomeData = useCallback(async () => {
    try {
      setLoading(true);

      try {
        const gamificacaoResponse = await apiService.get<{ success: boolean; data?: GamificationData }>('/gamificacao');
        if (gamificacaoResponse.success && gamificacaoResponse.data) {
          setGamification(gamificacaoResponse.data);
        } else {
          setGamification(null);
        }
      } catch (error: any) {
        console.error('Erro ao carregar gamificação:', error);
        setGamification(null);
      }

      try {
        const summaryResponse = await apiService.get<{ success: boolean; data?: MonthlySummary }>('/resumo-mensal');
        if (summaryResponse.success && summaryResponse.data) {
          setMonthlySummary(summaryResponse.data);
        } else {
          setMonthlySummary(null);
        }
      } catch (error: any) {
        console.error('Erro ao carregar resumo mensal:', error);
        setMonthlySummary(null);
      }

      try {
        const goalsResponse = await apiService.get<{ 
          success: boolean; 
          data?: {
            totalPoints?: number;
            performanceGoals?: any[];
            habitGoals?: any[];
          }
        }>('/metas');
        if (goalsResponse.success && goalsResponse.data) {
          const allGoals: Goal[] = [];
          
          if (goalsResponse.data.performanceGoals && goalsResponse.data.performanceGoals.length > 0) {
            goalsResponse.data.performanceGoals.forEach((goal: any) => {
              let progress = 0;
              let currentAmount = 0;
              let targetAmount = 0;
              
              if (goal.progressType === 'amount') {
                currentAmount = goal.currentAmount || 0;
                targetAmount = goal.targetAmount || 0;
                progress = targetAmount > 0 ? Math.min(currentAmount / targetAmount, 1) : 0;
              } else {
                currentAmount = goal.currentStreak || 0;
                targetAmount = goal.targetAmount || 0;
                progress = targetAmount > 0 ? Math.min(currentAmount / targetAmount, 1) : 0;
              }
              
              allGoals.push({
                id: goal.id,
                title: goal.title,
                description: goal.description || '',
                progress: progress,
                target: targetAmount,
                icon: goal.icon || 'flag',
                color: goal.iconColor || '#4A90E2',
                currentAmount: currentAmount,
                targetAmount: targetAmount,
              });
            });
          }
          
          if (goalsResponse.data.habitGoals && goalsResponse.data.habitGoals.length > 0) {
            goalsResponse.data.habitGoals.forEach((goal: any) => {
              let progress = 0;
              let currentAmount = 0;
              let targetAmount = 0;
              
              if (goal.progressType === 'amount') {
                currentAmount = goal.currentAmount || 0;
                targetAmount = goal.targetAmount || 0;
                progress = targetAmount > 0 ? Math.min(currentAmount / targetAmount, 1) : 0;
              } else {
                currentAmount = goal.currentStreak || 0;
                targetAmount = goal.targetAmount || 0;
                progress = targetAmount > 0 ? Math.min(currentAmount / targetAmount, 1) : 0;
              }
              
              allGoals.push({
                id: goal.id,
                title: goal.title,
                description: goal.description || '',
                progress: progress,
                target: targetAmount,
                icon: goal.icon || 'flame',
                color: goal.iconColor || '#FFA07A',
                currentAmount: currentAmount,
                targetAmount: targetAmount,
              });
            });
          }
          
          setGoals(allGoals);
        } else {
          setGoals([]);
        }
      } catch (error: any) {
        console.error('Erro ao carregar metas:', error);
        setGoals([]);
      }

      try {
        const todasDespesas = await apiService.get<{ success: boolean; data?: DespesaFixa[] }>('/despesas-fixas');
        if (todasDespesas.success && todasDespesas.data) {
          setDespesasFixas(todasDespesas.data);
        } else {
          setDespesasFixas([]);
        }
        
        try {
          const despesasVencidasResponse = await apiService.get<{ success: boolean; data?: DespesaFixa[] }>('/despesas-fixas/vencidas');
          if (despesasVencidasResponse.success && despesasVencidasResponse.data && despesasVencidasResponse.data.length > 0) {
            const despesaVencida = despesasVencidasResponse.data[0];
            setDespesaFixaAlert(despesaVencida);
            setIsDespesaVencida(true);
            setShowAlertModal(true);
            return;
          }
        } catch (error: any) {
          console.error('Erro ao carregar despesas vencidas:', error);
        }
        
        try {
          const despesasResponse = await apiService.get<{ success: boolean; data?: DespesaFixa[] }>('/despesas-fixas/proximas/vencimentos');
          if (despesasResponse.success && despesasResponse.data && despesasResponse.data.length > 0) {
            const hoje = new Date().getDate();
            const despesaHoje = despesasResponse.data.find(d => d.dia_vencimento === hoje);
            if (despesaHoje) {
              setDespesaFixaAlert(despesaHoje);
              setIsDespesaVencida(false);
              setShowAlertModal(true);
            }
          }
        } catch (error: any) {
          console.error('Erro ao carregar próximas despesas:', error);
        }
      } catch (error: any) {
        console.error('Erro ao carregar despesas fixas:', error);
        setDespesasFixas([]);
      }
    } catch (error: any) {
      console.error('Erro geral ao carregar dados da home:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData])
  );

  const handleConfirmarPagamento = async () => {
    if (!despesaFixaAlert) return;

    try {
      const response = await apiService.post(`/despesas-fixas/${despesaFixaAlert.id}/confirmar-pagamento`, {});
      
      if (response.success) {
        const pontos = response.data?.pontos_ganhos || 0;
        const pagouEmDia = response.data?.pagou_em_dia || false;
        
        setShowAlertModal(false);
        setDespesaFixaAlert(null);
        setIsDespesaVencida(false);
        
        setTimeout(() => {
          alert(
            `✅ Pagamento confirmado!\n\n` +
            `${pagouEmDia ? '🎉 Parabéns! Você pagou em dia!' : '⚠️ Você pagou após o vencimento'}\n\n` +
            `💰 Pontos ganhos: ${pontos}`
          );
        }, 300);
        
        loadHomeData();
      }
    } catch (error: any) {
      alert('Erro ao confirmar pagamento: ' + (error.response?.data?.message || 'Erro desconhecido'));
    }
  };

  const handleLembrarDepois = () => {
    setShowAlertModal(false);
    setDespesaFixaAlert(null);
    setIsDespesaVencida(false);
  };

  const handleNaoPaguei = () => {
    setShowAlertModal(false);
    setDespesaFixaAlert(null);
    setIsDespesaVencida(false);
  };

  const defaultGamification: GamificationData = {
    level: 1,
    currentXP: 0,
    maxXP: 100,
    xpToNextLevel: 100,
  };

  const defaultSummary: MonthlySummary = {
    month: new Date().toLocaleString('pt-BR', { month: 'long' }),
    lastUpdated: 'Nunca',
    profits: 0,
    expenses: 0,
    positiveBalance: 0,
    largestExpenseCategory: '-',
  };

  const displayGamification = gamification || defaultGamification;
  const displaySummary = monthlySummary || defaultSummary;

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <ProgressCard
          level={displayGamification.level}
          currentXP={displayGamification.currentXP}
          maxXP={displayGamification.maxXP}
          xpToNextLevel={displayGamification.xpToNextLevel}
        />

        <CalendarWithSummary
          despesasFixas={despesasFixas}
          summary={displaySummary}
        />

        {goals.length > 0 ? (
          goals.map((goal) => (
            <IndividualGoalCard 
              key={goal.id} 
              goal={goal} 
              onPress={() => {}}
            />
          ))
        ) : (
          <View style={[styles.content, { padding: 20, alignItems: 'center' }]}>
            <Text style={[styles.headerTitle, { color: colors.textSecondary }]}>
              Metas indisponíveis no momento
            </Text>
          </View>
        )}
      </ScrollView>

      <DespesaFixaAlertModal
        visible={showAlertModal}
        despesa={despesaFixaAlert}
        isVencida={isDespesaVencida}
        onConfirm={handleConfirmarPagamento}
        onCancel={() => {
          setShowAlertModal(false);
          setDespesaFixaAlert(null);
          setIsDespesaVencida(false);
        }}
        onLater={handleLembrarDepois}
        onNaoPaguei={handleNaoPaguei}
      />
    </SafeAreaView>
  );
}
