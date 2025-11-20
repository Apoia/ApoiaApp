import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { createAddDespesaStyles } from '../styles/AddDespesaStyles';

const iconesDisponiveis = [
  { name: 'flag', label: 'Bandeira' },
  { name: 'trophy', label: 'Troféu' },
  { name: 'star', label: 'Estrela' },
  { name: 'flame', label: 'Chama' },
  { name: 'cash', label: 'Dinheiro' },
  { name: 'wallet', label: 'Carteira' },
  { name: 'trending-up', label: 'Crescimento' },
  { name: 'calendar', label: 'Calendário' },
  { name: 'checkmark-circle', label: 'Check' },
  { name: 'target', label: 'Alvo' },
];

const coresDisponiveis = [
  { value: '#4A90E2', label: 'Azul' },
  { value: '#50C878', label: 'Verde' },
  { value: '#FF6B6B', label: 'Vermelho' },
  { value: '#F59E0B', label: 'Laranja' },
  { value: '#9B59B6', label: 'Roxo' },
  { value: '#87CEEB', label: 'Azul Claro' },
  { value: '#FFB6C1', label: 'Rosa' },
  { value: '#FFA07A', label: 'Salmão' },
];

export default function CriarMetaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createAddDespesaStyles(colors);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'error' as 'success' | 'error' | 'warning',
    title: '',
    message: ''
  });

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'performance' | 'habit'>('performance');
  const [icone, setIcone] = useState('flag');
  const [corIcone, setCorIcone] = useState('#4A90E2');
  const [tipoProgresso, setTipoProgresso] = useState<'amount' | 'completed' | 'streak' | 'weekly'>('amount');
  const [valorMeta, setValorMeta] = useState('');
  const [valorMetaDisplay, setValorMetaDisplay] = useState('');
  const [pontos, setPontos] = useState('');

  const handleValorMetaChange = (text: string) => {
    if (tipoProgresso === 'amount') {
      const formatted = formatCurrencyInput(text);
      setValorMetaDisplay(formatted);
      setValorMeta(String(parseCurrency(formatted)));
    } else {
      setValorMeta(text);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha o título da meta'
      });
      return;
    }

    if (tipoProgresso === 'amount' && (!valorMetaDisplay || parseCurrency(valorMetaDisplay) <= 0)) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha o valor da meta'
      });
      return;
    }

    setLoading(true);

    try {
      const data: any = {
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        tipo: tipo,
        icone: icone,
        cor_icone: corIcone,
        tipo_progresso: tipoProgresso,
        pontos: pontos ? parseInt(pontos) : 0,
      };

      if (tipoProgresso === 'amount') {
        data.valor_meta = parseCurrency(valorMetaDisplay);
      }

      const response = await apiService.post('/metas', data);

      if (response.success) {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Sucesso!',
          message: 'Meta criada com sucesso'
        });

        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        setAlert({
          visible: true,
          type: 'error',
          title: 'Erro',
          message: response.message || 'Erro ao criar meta'
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Meta</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Título da Meta *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Economizar para viagem..."
              value={titulo}
              onChangeText={setTitulo}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva sua meta..."
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tipo de Meta *</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  tipo === 'performance' && styles.optionButtonSelected
                ]}
                onPress={() => setTipo('performance')}
              >
                <Ionicons
                  name="trending-up"
                  size={20}
                  color={tipo === 'performance' ? '#fff' : colors.text}
                />
                <Text
                  style={[
                    styles.optionText,
                    tipo === 'performance' && styles.optionTextSelected
                  ]}
                >
                  Performance
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  tipo === 'habit' && styles.optionButtonSelected
                ]}
                onPress={() => setTipo('habit')}
              >
                <Ionicons
                  name="repeat"
                  size={20}
                  color={tipo === 'habit' ? '#fff' : colors.text}
                />
                <Text
                  style={[
                    styles.optionText,
                    tipo === 'habit' && styles.optionTextSelected
                  ]}
                >
                  Hábito
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tipo de Progresso *</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  tipoProgresso === 'amount' && styles.optionButtonSelected
                ]}
                onPress={() => setTipoProgresso('amount')}
              >
                <Ionicons
                  name="cash"
                  size={20}
                  color={tipoProgresso === 'amount' ? '#fff' : colors.text}
                />
                <Text
                  style={[
                    styles.optionText,
                    tipoProgresso === 'amount' && styles.optionTextSelected
                  ]}
                >
                  Valor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  tipoProgresso === 'streak' && styles.optionButtonSelected
                ]}
                onPress={() => setTipoProgresso('streak')}
              >
                <Ionicons
                  name="flame"
                  size={20}
                  color={tipoProgresso === 'streak' ? '#fff' : colors.text}
                />
                <Text
                  style={[
                    styles.optionText,
                    tipoProgresso === 'streak' && styles.optionTextSelected
                  ]}
                >
                  Sequência
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  tipoProgresso === 'weekly' && styles.optionButtonSelected
                ]}
                onPress={() => setTipoProgresso('weekly')}
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color={tipoProgresso === 'weekly' ? '#fff' : colors.text}
                />
                <Text
                  style={[
                    styles.optionText,
                    tipoProgresso === 'weekly' && styles.optionTextSelected
                  ]}
                >
                  Semanal
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {tipoProgresso === 'amount' && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Valor da Meta *</Text>
              <View style={styles.currencyContainer}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={styles.currencyInput}
                  placeholder="0,00"
                  value={valorMetaDisplay}
                  onChangeText={handleValorMetaChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ícone</Text>
            <View style={styles.optionsContainer}>
              {iconesDisponiveis.map((icon) => (
                <TouchableOpacity
                  key={icon.name}
                  style={[
                    styles.iconButton,
                    icone === icon.name && {
                      backgroundColor: corIcone + '30',
                      borderColor: corIcone,
                      borderWidth: 2,
                    }
                  ]}
                  onPress={() => setIcone(icon.name)}
                >
                  <Ionicons
                    name={icon.name as any}
                    size={24}
                    color={icone === icon.name ? corIcone : colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cor do Ícone</Text>
            <View style={styles.optionsContainer}>
              {coresDisponiveis.map((cor) => (
                <TouchableOpacity
                  key={cor.value}
                  style={[
                    styles.colorButton,
                    {
                      backgroundColor: cor.value,
                      borderWidth: corIcone === cor.value ? 3 : 0,
                      borderColor: '#fff',
                    }
                  ]}
                  onPress={() => setCorIcone(cor.value)}
                >
                  {corIcone === cor.value && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Pontos (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={pontos}
              onChangeText={setPontos}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Criando...' : 'Criar Meta'}
            </Text>
          </TouchableOpacity>
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

