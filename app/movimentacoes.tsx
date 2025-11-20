import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import { createGoalsStyles } from '../styles/GoalsStyles';
import { spacing } from '../styles/theme';

interface Transacao {
  id: number;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  categoria: string | null;
  data_transacao: string;
  forma_pagamento: string;
  paga: boolean;
  observacao: string | null;
}

export default function MovimentacoesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createGoalsStyles(colors);

  const [loading, setLoading] = useState(true);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filter, setFilter] = useState<'all' | 'receita' | 'despesa'>('all');

  useEffect(() => {
    loadTransacoes();
  }, [filter]);

  const loadTransacoes = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? '/transacoes' : `/transacoes?tipo=${filter}`;
      const response = await apiService.get<{ success: boolean; data?: Transacao[] }>(url);
      if (response.success && response.data) {
        setTransacoes(response.data);
      } else {
        setTransacoes([]);
      }
    } catch (error) {
      setTransacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFormaPagamentoLabel = (forma: string) => {
    const formas: { [key: string]: string } = {
      'dinheiro': 'Dinheiro',
      'pix': 'PIX',
      'debito': 'Débito',
      'credito': 'Crédito',
      'outro': 'Outro'
    };
    return formas[forma] || forma;
  };

  const filteredTransacoes = transacoes.sort((a, b) => {
    const dateA = new Date(a.data_transacao).getTime();
    const dateB = new Date(b.data_transacao).getTime();
    return dateB - dateA;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Movimentações</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            filter === 'all' && { color: '#fff', fontWeight: '700' }
          ]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'receita' && { backgroundColor: colors.success }
          ]}
          onPress={() => setFilter('receita')}
        >
          <Text style={[
            styles.filterText,
            filter === 'receita' && { color: '#fff', fontWeight: '700' }
          ]}>
            Receitas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'despesa' && { backgroundColor: colors.error }
          ]}
          onPress={() => setFilter('despesa')}
        >
          <Text style={[
            styles.filterText,
            filter === 'despesa' && { color: '#fff', fontWeight: '700' }
          ]}>
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>Carregando...</Text>
          </View>
        ) : filteredTransacoes.length === 0 ? (
          <View style={styles.welcomeSection}>
            <Ionicons name="receipt-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.welcomeTitle, { marginTop: 16 }]}>
              Nenhuma movimentação encontrada
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {filter === 'all' 
                ? 'Você ainda não possui movimentações cadastradas'
                : `Você ainda não possui ${filter === 'receita' ? 'receitas' : 'despesas'} cadastradas`
              }
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Suas Movimentações</Text>
              <Text style={styles.welcomeSubtitle}>
                {filteredTransacoes.length} {filteredTransacoes.length === 1 ? 'movimentação encontrada' : 'movimentações encontradas'}
              </Text>
            </View>

            {filteredTransacoes.map((transacao) => (
              <View
                key={transacao.id}
                style={[
                  styles.motivationCard,
                  { marginHorizontal: spacing.xl, marginBottom: spacing.md }
                ]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                      <Ionicons
                        name={transacao.tipo === 'receita' ? 'arrow-up-circle' : 'arrow-down-circle'}
                        size={24}
                        color={transacao.tipo === 'receita' ? colors.success : colors.error}
                      />
                      <Text style={[styles.motivationTitle, { marginLeft: spacing.sm, fontSize: 18, flex: 1 }]}>
                        {transacao.descricao}
                      </Text>
                      <Text
                        style={[
                          styles.motivationText,
                          {
                            fontSize: 18,
                            fontWeight: '700',
                            color: transacao.tipo === 'receita' ? colors.success : colors.error
                          }
                        ]}
                      >
                        {transacao.tipo === 'receita' ? '+' : '-'} {formatCurrency(transacao.valor)}
                      </Text>
                    </View>
                    
                    <View style={{ marginLeft: 32 }}>
                      <Text style={[styles.motivationText, { marginBottom: spacing.xs }]}>
                        <Text style={{ fontWeight: '600' }}>Data:</Text> {formatDate(transacao.data_transacao)}
                      </Text>
                      {transacao.categoria && (
                        <Text style={[styles.motivationText, { marginBottom: spacing.xs }]}>
                          <Text style={{ fontWeight: '600' }}>Categoria:</Text> {transacao.categoria}
                        </Text>
                      )}
                      <Text style={[styles.motivationText, { marginBottom: spacing.xs }]}>
                        <Text style={{ fontWeight: '600' }}>Forma:</Text> {getFormaPagamentoLabel(transacao.forma_pagamento)}
                      </Text>
                      {transacao.tipo === 'despesa' && (
                        <Text style={[styles.motivationText, { marginBottom: spacing.xs }]}>
                          <Text style={{ fontWeight: '600' }}>Status:</Text>{' '}
                          <Text style={{ color: transacao.paga ? colors.success : colors.warning }}>
                            {transacao.paga ? 'Paga' : 'Pendente'}
                          </Text>
                        </Text>
                      )}
                      {transacao.observacao && (
                        <Text style={styles.motivationText}>
                          <Text style={{ fontWeight: '600' }}>Obs:</Text> {transacao.observacao}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

