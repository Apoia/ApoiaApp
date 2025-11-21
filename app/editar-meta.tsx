import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CustomAlert from '../components/CustomAlert';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import { formatCurrencyInput, parseCurrency } from '../utils/masks';
import { createAddStyles } from '../styles/AddStyles';

export default function EditarMetaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, spacing } = useTheme();
  const styles = createAddStyles(colors);

  const metaId = params.id ? parseInt(params.id as string) : null;

  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorAtual, setValorAtual] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [sequenciaAtual, setSequenciaAtual] = useState('');
  const [progressType, setProgressType] = useState<'amount' | 'streak'>('amount');
  const [progressoPercentual, setProgressoPercentual] = useState(0);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    if (metaId) {
      loadMeta();
    }
  }, [metaId]);

  const loadMeta = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/metas/${metaId}`);
      
      if (response.success && response.data) {
        const meta = response.data;
        setTitulo(meta.titulo || '');
        setDescricao(meta.descricao || '');
        setProgressType(meta.tipo_progresso || 'amount');
        
        if (meta.tipo_progresso === 'amount') {
          // Converter número para string formatada (multiplicar por 100 para centavos)
          const valorAtualNum = meta.valor_atual || 0;
          const valorMetaNum = meta.valor_meta || 0;
          setValorAtual(valorAtualNum > 0 ? formatCurrencyInput(String(Math.round(valorAtualNum * 100))) : '');
          setValorMeta(valorMetaNum > 0 ? formatCurrencyInput(String(Math.round(valorMetaNum * 100))) : '');
          
          // Calcular progresso inicial
          if (valorMetaNum > 0) {
            const progresso = Math.min((valorAtualNum / valorMetaNum) * 100, 100);
            setProgressoPercentual(progresso);
          }
        } else if (meta.tipo_progresso === 'streak') {
          setSequenciaAtual(String(meta.sequencia_atual || 0));
          setValorMeta(String(meta.valor_meta || 0));
          
          // Calcular progresso inicial para streak
          const sequenciaNum = meta.sequencia_atual || 0;
          const metaNum = meta.valor_meta || 0;
          if (metaNum > 0) {
            const progresso = Math.min((sequenciaNum / metaNum) * 100, 100);
            setProgressoPercentual(progresso);
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar a meta');
    } finally {
      setLoading(false);
    }
  };

  const handleValorAtualChange = (text: string) => {
    // Usa a função de máscara que já existe no projeto
    const formatted = formatCurrencyInput(text);
    setValorAtual(formatted);
    
    // Calcular progresso em tempo real
    if (progressType === 'amount' && valorMeta) {
      const valorAtualNum = parseCurrency(formatted);
      const valorMetaNum = parseCurrency(valorMeta);
      if (valorMetaNum > 0) {
        const progresso = Math.min((valorAtualNum / valorMetaNum) * 100, 100);
        setProgressoPercentual(progresso);
      }
    }
  };

  const handleValorMetaChange = (text: string) => {
    if (progressType === 'amount') {
      // Usa a função de máscara que já existe no projeto
      const formatted = formatCurrencyInput(text);
      setValorMeta(formatted);
      
      // Recalcular progresso quando a meta muda
      if (valorAtual) {
        const valorAtualNum = parseCurrency(valorAtual);
        const valorMetaNum = parseCurrency(formatted);
        if (valorMetaNum > 0) {
          const progresso = Math.min((valorAtualNum / valorMetaNum) * 100, 100);
          setProgressoPercentual(progresso);
        } else {
          setProgressoPercentual(0);
        }
      }
    } else {
      // Para streak, apenas números
      setValorMeta(text.replace(/[^\d]/g, ''));
      
      // Calcular progresso para streak
      if (sequenciaAtual && text) {
        const sequenciaNum = parseInt(sequenciaAtual) || 0;
        const metaNum = parseInt(text) || 0;
        if (metaNum > 0) {
          const progresso = Math.min((sequenciaNum / metaNum) * 100, 100);
          setProgressoPercentual(progresso);
        } else {
          setProgressoPercentual(0);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Preencha o título da meta');
      return;
    }

    setLoading(true);

    try {
      const data: any = {
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
      };

      if (progressType === 'amount') {
        data.valor_atual = parseCurrency(valorAtual);
        if (valorMeta) {
          data.valor_meta = parseCurrency(valorMeta);
        }
      } else if (progressType === 'streak') {
        data.sequencia_atual = parseInt(sequenciaAtual) || 0;
        if (valorMeta) {
          data.valor_meta = parseInt(valorMeta) || 0;
        }
      }

      const response = await apiService.put(`/metas/${metaId}`, data);

      if (response.success) {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Sucesso!',
          message: 'Meta atualizada com sucesso'
        });
        
        // Fechar após 1.5 segundos e voltar
        setTimeout(() => {
          setAlert({ ...alert, visible: false });
          router.back();
        }, 1500);
      } else {
        setAlert({
          visible: true,
          type: 'error',
          title: 'Erro',
          message: response.message || 'Erro ao atualizar meta'
        });
      }
    } catch (error: any) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao conectar com o servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizarAutomatico = async () => {
    const mensagem = progressType === 'amount' 
      ? 'O sistema calculará automaticamente:\n\n• Receitas totais: R$ X\n• Despesas pagas: R$ Y\n• Economia = Receitas - Despesas\n\nDeseja atualizar o progresso agora?'
      : 'O sistema atualizará a sequência de dias baseado no seu perfil de gamificação.\n\nDeseja atualizar agora?';

    Alert.alert(
      'Atualizar Progresso Automaticamente',
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Atualizar',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.post(`/metas/${metaId}/atualizar-progresso`);
              
              if (response.success) {
                // Recarregar a meta com os novos valores
                await loadMeta();
                
                const novoValor = progressType === 'amount' 
                  ? formatCurrencyInput(String(Math.round((response.data?.valor_atual || 0) * 100)))
                  : String(response.data?.sequencia_atual || 0);
                
                setAlert({
                  visible: true,
                  type: 'success',
                  title: 'Sucesso!',
                  message: `Progresso atualizado!\n\nValor atual: ${progressType === 'amount' ? 'R$ ' : ''}${novoValor}${progressType === 'streak' ? ' dias' : ''}`
                });
              } else {
                setAlert({
                  visible: true,
                  type: 'error',
                  title: 'Erro',
                  message: response.message || 'Não foi possível atualizar o progresso'
                });
              }
            } catch (error: any) {
              setAlert({
                visible: true,
                type: 'error',
                title: 'Erro',
                message: error.response?.data?.message || 'Não foi possível atualizar o progresso'
              });
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Meta</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ex: Economizar R$ 1.000"
                placeholderTextColor={colors.textSecondary}
                value={titulo}
                onChangeText={setTitulo}
                editable={!loading}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { color: colors.text }
                ]}
                placeholder="Descreva sua meta..."
                placeholderTextColor={colors.textSecondary}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            </View>

            {progressType === 'amount' && (
              <>
                <View style={styles.fieldContainer}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
                    <Text style={styles.label}>Valor Atual</Text>
                    <TouchableOpacity
                      onPress={handleAtualizarAutomatico}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        backgroundColor: colors.primary + '20',
                        borderRadius: 8
                      }}
                    >
                      <Ionicons name="refresh" size={16} color={colors.primary} />
                      <Text style={{ color: colors.primary, marginLeft: spacing.xs, fontSize: 12 }}>
                        Atualizar Auto
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="R$ 0,00"
                    placeholderTextColor={colors.textSecondary}
                    value={valorAtual}
                    onChangeText={handleValorAtualChange}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                  
                  {/* Barra de progresso em tempo real */}
                  {valorMeta && parseCurrency(valorMeta) > 0 && (
                    <View style={{ marginTop: spacing.md }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                        <Text style={[styles.helperText, { color: colors.textSecondary, fontSize: 12 }]}>
                          Progresso
                        </Text>
                        <Text style={[styles.helperText, { color: colors.primary, fontSize: 12, fontWeight: '600' }]}>
                          {progressoPercentual.toFixed(0)}%
                        </Text>
                      </View>
                      <View style={{
                        height: 8,
                        backgroundColor: colors.border + '40',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <View style={{
                          height: '100%',
                          width: `${Math.min(progressoPercentual, 100)}%`,
                          backgroundColor: progressoPercentual >= 100 ? colors.success : colors.primary,
                          borderRadius: 4,
                          transition: 'width 0.3s ease'
                        }} />
                      </View>
                    </View>
                  )}
                  
                  <Text style={[styles.helperText, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                    Você pode atualizar manualmente ou usar o botão "Atualizar Auto" para calcular automaticamente:{'\n'}
                    • Receitas totais - Despesas pagas = Economia atual
                  </Text>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Valor da Meta</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="R$ 0,00"
                    placeholderTextColor={colors.textSecondary}
                    value={valorMeta}
                    onChangeText={handleValorMetaChange}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
              </>
            )}

            {progressType === 'streak' && (
              <>
                <View style={styles.fieldContainer}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
                    <Text style={styles.label}>Sequência Atual (dias)</Text>
                    <TouchableOpacity
                      onPress={handleAtualizarAutomatico}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: spacing.sm,
                        paddingVertical: spacing.xs,
                        backgroundColor: colors.primary + '20',
                        borderRadius: 8
                      }}
                    >
                      <Ionicons name="refresh" size={16} color={colors.primary} />
                      <Text style={{ color: colors.primary, marginLeft: spacing.xs, fontSize: 12 }}>
                        Atualizar Auto
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={sequenciaAtual}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^\d]/g, '');
                      setSequenciaAtual(cleaned);
                      
                      // Calcular progresso em tempo real para streak
                      if (valorMeta) {
                        const sequenciaNum = parseInt(cleaned) || 0;
                        const metaNum = parseInt(valorMeta) || 0;
                        if (metaNum > 0) {
                          const progresso = Math.min((sequenciaNum / metaNum) * 100, 100);
                          setProgressoPercentual(progresso);
                        } else {
                          setProgressoPercentual(0);
                        }
                      }
                    }}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                  
                  {/* Barra de progresso em tempo real para streak */}
                  {valorMeta && parseInt(valorMeta) > 0 && (
                    <View style={{ marginTop: spacing.md }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                        <Text style={[styles.helperText, { color: colors.textSecondary, fontSize: 12 }]}>
                          Progresso
                        </Text>
                        <Text style={[styles.helperText, { color: colors.primary, fontSize: 12, fontWeight: '600' }]}>
                          {progressoPercentual.toFixed(0)}%
                        </Text>
                      </View>
                      <View style={{
                        height: 8,
                        backgroundColor: colors.border + '40',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <View style={{
                          height: '100%',
                          width: `${Math.min(progressoPercentual, 100)}%`,
                          backgroundColor: progressoPercentual >= 100 ? colors.success : colors.primary,
                          borderRadius: 4,
                          transition: 'width 0.3s ease'
                        }} />
                      </View>
                    </View>
                  )}
                  
                  <Text style={[styles.helperText, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                    Quantos dias consecutivos você já completou
                  </Text>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Meta de Sequência (dias)</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="30"
                    placeholderTextColor={colors.textSecondary}
                    value={valorMeta}
                    onChangeText={handleValorMetaChange}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary },
                loading && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.submitButtonText}>Salvando...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

