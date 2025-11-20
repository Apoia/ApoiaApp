import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';
import NewCategoryModal from '../components/NewCategoryModal';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import { formatCurrencyInput, formatDate, formatDateToAPI, parseCurrency } from '../utils/masks';
import { createAddDespesaStyles } from '../styles/AddDespesaStyles';
import { spacing } from '../styles/theme';

export default function AddReceitaScreen() {
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

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [valorDisplay, setValorDisplay] = useState('');
  const [categoria, setCategoria] = useState('');
  const [dataTransacao, setDataTransacao] = useState('');
  const [dataTransacaoDisplay, setDataTransacaoDisplay] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'pix' | 'debito' | 'credito' | 'outro'>('dinheiro');
  const [observacao, setObservacao] = useState('');
  const [showCategorias, setShowCategorias] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const categoriasReceitaBase = [
    'Salário',
    'Freelance',
    'Investimento',
    'Venda',
    'Aluguel',
    'Dividendos'
  ];

  const categoriasReceita = [...categoriasReceitaBase, ...customCategories];

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    setDataTransacaoDisplay(formattedDate);
    setDataTransacao(`${year}-${month}-${day}`);
    loadCustomCategories();
  }, []);

  const loadCustomCategories = async () => {
    try {
      const stored = await AsyncStorage.getItem('customCategories_receita');
      if (stored) {
        setCustomCategories(JSON.parse(stored));
      }
    } catch (error) {
      setCustomCategories([]);
    }
  };

  const saveCustomCategory = async (categoryName: string) => {
    try {
      const updated = [...customCategories, categoryName];
      setCustomCategories(updated);
      await AsyncStorage.setItem('customCategories_receita', JSON.stringify(updated));
      setCategoria(categoryName);
      if (!descricao.trim()) {
        setDescricao(categoryName);
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Erro ao salvar categoria'
      });
    }
  };

  const handleValorChange = (text: string) => {
    const formatted = formatCurrencyInput(text);
    setValorDisplay(formatted);
    setValor(String(parseCurrency(formatted)));
  };

  const handleDataTransacaoChange = (text: string) => {
    const formatted = formatDate(text);
    if (formatted.length <= 10) {
      setDataTransacaoDisplay(formatted);
      if (formatted.length === 10) {
        setDataTransacao(formatDateToAPI(formatted));
      }
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleCategoriaSelect = (cat: string) => {
    if (cat === 'Outros...') {
      setShowCategorias(false);
      setShowNewCategoryModal(true);
      return;
    }
    
    if (categoria === cat) {
      setCategoria('');
    } else {
      setCategoria(cat);
      if (!descricao.trim()) {
        setDescricao(cat);
      }
    }
    setShowCategorias(false);
  };

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha a descrição'
      });
      return;
    }

    const valorNumero = parseCurrency(valorDisplay);
    if (!valorDisplay || valorNumero <= 0) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha um valor válido'
      });
      return;
    }

    if (!dataTransacao || dataTransacaoDisplay.length !== 10) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha a data da transação corretamente (DD/MM/YYYY)'
      });
      return;
    }

    setLoading(true);

    try {
      const data = {
        tipo: 'receita',
        descricao: descricao.trim(),
        valor: valorNumero,
        categoria: categoria.trim() || null,
        data_transacao: dataTransacao,
        forma_pagamento: formaPagamento,
        observacao: observacao.trim() || null,
      };

      const response = await apiService.post('/transacoes', data);

      if (response.success) {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Sucesso!',
          message: 'Receita adicionada com sucesso'
        });

        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        setAlert({
          visible: true,
          type: 'error',
          title: 'Erro',
          message: response.message || 'Erro ao adicionar receita'
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
          <Text style={styles.headerTitle}>Adicionar Receita</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Salário, Freelance, Venda..."
              value={descricao}
              onChangeText={setDescricao}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Valor *</Text>
            <View style={styles.currencyContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.currencyInput}
                placeholder="0,00"
                value={valorDisplay}
                onChangeText={handleValorChange}
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity
              style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              onPress={() => setShowCategorias(!showCategorias)}
            >
              <Text style={[styles.inputText, !categoria && { color: colors.textSecondary }]}>
                {categoria || 'Selecione uma categoria...'}
              </Text>
              <Ionicons 
                name={showCategorias ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
            
            {showCategorias && (
              <View style={styles.dropdown}>
                <ScrollView 
                  style={styles.dropdownScroll}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
                  {categoriasReceita.map((cat, index) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.dropdownItem,
                        categoria === cat && styles.dropdownItemSelected
                      ]}
                      onPress={() => handleCategoriaSelect(cat)}
                    >
                      <Text style={[
                        styles.dropdownText,
                        categoria === cat && styles.dropdownTextSelected
                      ]}>
                        {cat}
                      </Text>
                      {categoria === cat && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      { borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.xs, paddingTop: spacing.md }
                    ]}
                    onPress={() => handleCategoriaSelect('Outros...')}
                  >
                    <Ionicons name="add-circle-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                    <Text style={[styles.dropdownText, { color: colors.primary, fontWeight: '600' }]}>
                      Outros...
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Data da Receita *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={dataTransacaoDisplay}
              onChangeText={handleDataTransacaoChange}
              keyboardType="numeric"
              maxLength={10}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Forma de Recebimento *</Text>
            <View style={styles.optionsContainer}>
              {[
                { value: 'dinheiro', label: 'Dinheiro', icon: 'cash' },
                { value: 'pix', label: 'PIX', icon: 'flash' },
                { value: 'debito', label: 'Débito', icon: 'card' },
                { value: 'credito', label: 'Crédito', icon: 'card-outline' },
                { value: 'outro', label: 'Outro', icon: 'ellipsis-horizontal' },
              ].map((forma) => (
                <TouchableOpacity
                  key={forma.value}
                  style={[
                    styles.optionButton,
                    formaPagamento === forma.value && styles.optionButtonSelected
                  ]}
                  onPress={() => setFormaPagamento(forma.value as any)}
                >
                  <Ionicons 
                    name={forma.icon as any} 
                    size={20} 
                    color={formaPagamento === forma.value ? '#fff' : colors.text} 
                  />
                  <Text style={[
                    styles.optionText,
                    formaPagamento === forma.value && styles.optionTextSelected
                  ]}>
                    {forma.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Observação</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observações adicionais..."
              value={observacao}
              onChangeText={setObservacao}
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Salvando...' : 'Salvar Receita'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <NewCategoryModal
        visible={showNewCategoryModal}
        onClose={() => setShowNewCategoryModal(false)}
        onSave={saveCustomCategory}
        type="receita"
      />

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

