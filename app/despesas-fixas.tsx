import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CustomAlert from '../components/CustomAlert';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import { createGoalsStyles } from '../styles/GoalsStyles';
import { shadows, spacing } from '../styles/theme';

interface DespesaFixa {
  id: number;
  descricao: string;
  valor: number;
  categoria: string | null;
  dia_vencimento: number;
  forma_pagamento: string;
  cartao: {
    id: number;
    nome: string;
    ultimos_4_digitos?: string;
  } | null;
  observacao: string | null;
}

export default function DespesasFixasScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createGoalsStyles(colors);

  const [loading, setLoading] = useState(true);
  const [despesasFixas, setDespesasFixas] = useState<DespesaFixa[]>([]);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'error' as 'success' | 'error' | 'warning',
    title: '',
    message: ''
  });

  useFocusEffect(
    useCallback(() => {
      loadDespesasFixas();
    }, [])
  );

  const loadDespesasFixas = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<{ success: boolean; data?: DespesaFixa[] }>('/despesas-fixas');
      if (response.success && response.data) {
        setDespesasFixas(response.data);
      } else {
        setDespesasFixas([]);
      }
    } catch (error) {
      setDespesasFixas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    router.push('/cadastrar-despesa-fixa');
  };

  const handleEdit = (despesa: DespesaFixa) => {
    router.push({
      pathname: '/cadastrar-despesa-fixa',
      params: { id: despesa.id.toString() }
    });
  };

  const handleDelete = (despesa: DespesaFixa) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente remover a despesa fixa "${despesa.descricao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.delete(`/despesas-fixas/${despesa.id}`);
              if (response.success) {
                setAlert({
                  visible: true,
                  type: 'success',
                  title: 'Sucesso!',
                  message: 'Despesa fixa removida com sucesso'
                });
                loadDespesasFixas();
              }
            } catch (error: any) {
              setAlert({
                visible: true,
                type: 'error',
                title: 'Erro',
                message: error.response?.data?.message || 'Erro ao remover despesa fixa'
              });
            }
          }
        }
      ]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Despesas Fixas</Text>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="add" size={24} color="#fff" />
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
        ) : despesasFixas.length === 0 ? (
          <View style={styles.welcomeSection}>
            <View style={[styles.emptyStateIconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="calendar-outline" size={80} color={colors.primary} />
            </View>
            <Text style={[styles.welcomeTitle, { marginTop: spacing.xl, fontSize: 24 }]}>
              Nenhuma despesa fixa cadastrada
            </Text>
            <Text style={[styles.welcomeSubtitle, { marginTop: spacing.sm, marginBottom: spacing.xl, textAlign: 'center', paddingHorizontal: spacing.lg }]}>
              Cadastre suas contas recorrentes para receber lembretes e ganhar pontos ao pagar em dia!
            </Text>
            <TouchableOpacity 
              style={{
                backgroundColor: colors.primary,
                borderRadius: 16,
                padding: 20,
                marginTop: 16,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }} 
              onPress={handleAdd}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="add-circle" size={32} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 }}>
                    Cadastrar Primeira Despesa Fixa
                  </Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '400' }}>
                    Comece a organizar suas contas
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Suas Despesas Fixas</Text>
              <Text style={styles.welcomeSubtitle}>
                {despesasFixas.length} {despesasFixas.length === 1 ? 'despesa cadastrada' : 'despesas cadastradas'}
              </Text>
            </View>

            {despesasFixas.map((despesa) => (
              <View 
                key={despesa.id} 
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: spacing.lg,
                  marginHorizontal: spacing.xl,
                  marginBottom: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  ...shadows.small,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.primary + '15',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: spacing.sm,
                      }}>
                        <Ionicons name="calendar" size={20} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: '700',
                          color: colors.text,
                          marginBottom: spacing.xs,
                        }}>
                          {despesa.descricao}
                        </Text>
                        <Text style={{
                          fontSize: 24,
                          fontWeight: '800',
                          color: colors.error,
                        }}>
                          {formatCurrency(despesa.valor)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.primary + '15',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => handleEdit(despesa)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="create-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.error + '15',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => handleDelete(despesa)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                  paddingTop: spacing.md,
                  gap: spacing.sm,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
                    <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                      Vence todo dia <Text style={{ fontWeight: '600', color: colors.text }}>{despesa.dia_vencimento}</Text>
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="card-outline" size={16} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
                    <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                      {getFormaPagamentoLabel(despesa.forma_pagamento)}
                      {despesa.cartao && (
                        <Text style={{ fontWeight: '600', color: colors.text }}>
                          {' • '}{despesa.cartao.nome}
                          {despesa.cartao.ultimos_4_digitos ? ` ****${despesa.cartao.ultimos_4_digitos}` : ''}
                        </Text>
                      )}
                    </Text>
                  </View>

                  {despesa.categoria && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
                      <View style={{
                        backgroundColor: colors.primary + '15',
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        borderRadius: 8,
                      }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>
                          {despesa.categoria}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </SafeAreaView>
  );
}

