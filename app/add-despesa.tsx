import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { 
  Alert, 
  KeyboardAvoidingView, 
  Modal,
  Platform, 
  SafeAreaView, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartaoModal from '../components/CartaoModal';
import CustomAlert from '../components/CustomAlert';
import NewCategoryModal from '../components/NewCategoryModal';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../utils/apiService';
import { formatCurrencyInput, formatDate, formatDateToAPI, parseCurrency } from '../utils/masks';
import { createAddDespesaStyles } from '../styles/AddDespesaStyles';
import { spacing } from '../styles/theme';

interface Cartao {
  id: number;
  nome: string;
  ultimos_4_digitos?: string;
  bandeira?: string;
}

export default function AddDespesaScreen() {
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
  const [dataVencimento, setDataVencimento] = useState('');
  const [dataVencimentoDisplay, setDataVencimentoDisplay] = useState('');
  const [paga, setPaga] = useState(false);
  const [dataPagamento, setDataPagamento] = useState('');
  const [dataPagamentoDisplay, setDataPagamentoDisplay] = useState('');
  const [observacao, setObservacao] = useState('');
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [cartaoSelecionado, setCartaoSelecionado] = useState<number | null>(null);
  const [showCartaoModal, setShowCartaoModal] = useState(false);
  const [showCartaoDropdown, setShowCartaoDropdown] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const categoriasDespesaBase = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Roupas',
    'Contas',
    'Compras',
    'Supermercado',
    'Restaurante',
    'Farmácia',
    'Combustível',
    'Estacionamento',
    'Pedágio',
    'Água',
    'Energia',
    'Internet',
    'Telefone',
    'TV/Streaming',
    'Academia',
    'Beleza',
    'Pet',
    'Presentes',
    'Impostos',
    'Seguro',
    'Manutenção',
    'Reforma',
    'Viagem',
    'Entretenimento',
    'Tecnologia',
    'Serviços',
    'Doações',
    'Empréstimos',
    'Investimentos'
  ];

  const categoriasDespesa = [...categoriasDespesaBase, ...customCategories];

  useFocusEffect(
    useCallback(() => {
      loadCartoes();
      loadCustomCategories();
    }, [])
  );

  const loadCustomCategories = async () => {
    try {
      const stored = await AsyncStorage.getItem('customCategories_despesa');
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
      await AsyncStorage.setItem('customCategories_despesa', JSON.stringify(updated));
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

  const loadCartoes = async () => {
    try {
      const response = await apiService.get<{ success: boolean; data?: Cartao[] }>('/cartoes');
      if (response.success && response.data) {
        setCartoes(response.data);
      }
    } catch (error) {
      setCartoes([]);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleFormaPagamentoPress = async (forma: 'dinheiro' | 'pix' | 'debito' | 'credito' | 'outro') => {
    if (forma === 'credito' || forma === 'debito') {
      if (cartoes.length === 0) {
        setShowCartaoModal(true);
        return;
      }
      setFormaPagamento(forma);
      setShowCartaoDropdown(true);
    } else {
      setFormaPagamento(forma);
      setCartaoSelecionado(null);
      setShowCartaoDropdown(false);
    }
  };

  const handleCadastrarCartao = () => {
    setShowCartaoModal(false);
    router.push('/cadastrar-cartao');
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

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    setDataTransacaoDisplay(formattedDate);
    setDataTransacao(`${year}-${month}-${day}`);
  }, []);

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

  const handleDataVencimentoChange = (text: string) => {
    const formatted = formatDate(text);
    if (formatted.length <= 10) {
      setDataVencimentoDisplay(formatted);
      if (formatted.length === 10) {
        setDataVencimento(formatDateToAPI(formatted));
      } else {
        setDataVencimento('');
      }
    }
  };

  const handleDataPagamentoChange = (text: string) => {
    const formatted = formatDate(text);
    if (formatted.length <= 10) {
      setDataPagamentoDisplay(formatted);
      if (formatted.length === 10) {
        setDataPagamento(formatDateToAPI(formatted));
      } else {
        setDataPagamento('');
      }
    }
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
      if ((formaPagamento === 'credito' || formaPagamento === 'debito') && !cartaoSelecionado) {
        setAlert({
          visible: true,
          type: 'warning',
          title: 'Atenção',
          message: 'Selecione um cartão'
        });
        setLoading(false);
        return;
      }

      const data: any = {
        tipo: 'despesa',
        descricao: descricao.trim(),
        valor: valorNumero,
        categoria: categoria.trim() || null,
        data_transacao: dataTransacao,
        forma_pagamento: formaPagamento,
        data_vencimento: dataVencimento || dataTransacao,
        paga: paga,
        data_pagamento: paga && dataPagamento ? dataPagamento : null,
        observacao: observacao.trim() || null,
      };

      if (cartaoSelecionado) {
        data.cartao_id = cartaoSelecionado;
      }

      const response = await apiService.post<{ success: boolean; message?: string }>('/transacoes', data);

      if (response.success) {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Sucesso!',
          message: 'Despesa adicionada com sucesso'
        });
        
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        setAlert({
          visible: true,
          type: 'error',
          title: 'Erro',
          message: response.message || 'Erro ao adicionar despesa'
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

  const formasPagamento = [
    { value: 'dinheiro', label: 'Dinheiro', icon: 'cash' },
    { value: 'pix', label: 'PIX', icon: 'flash' },
    { value: 'debito', label: 'Débito', icon: 'card' },
    { value: 'credito', label: 'Crédito', icon: 'card-outline' },
    { value: 'outro', label: 'Outro', icon: 'ellipsis-horizontal' },
  ];

  return (
    <SafeAreaView style={styles.container as any}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView as any}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adicionar Despesa</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Descrição */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Almoço, Conta de luz..."
              value={descricao}
              onChangeText={setDescricao}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Valor */}
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

          {/* Categoria */}
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
                  {categoriasDespesa.map((cat, index) => (
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

          {/* Data da Transação */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Data da Transação *</Text>
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

          {/* Forma de Pagamento */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Forma de Pagamento *</Text>
            <View style={styles.optionsContainer}>
              {formasPagamento.map((forma) => (
                <TouchableOpacity
                  key={forma.value}
                  style={[
                    styles.optionButton,
                    formaPagamento === forma.value && styles.optionButtonSelected
                  ]}
                  onPress={() => handleFormaPagamentoPress(forma.value as any)}
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

          {/* Seleção de Cartão (se crédito ou débito) */}
          {(formaPagamento === 'credito' || formaPagamento === 'debito') && cartoes.length > 0 && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Selecione o Cartão *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCartaoDropdown(!showCartaoDropdown)}
              >
                <Text style={{ color: cartaoSelecionado ? colors.text : colors.textSecondary }}>
                  {cartaoSelecionado
                    ? cartoes.find(c => c.id === cartaoSelecionado)?.nome || 'Selecione'
                    : 'Selecione um cartão'}
                </Text>
                <Ionicons 
                  name={showCartaoDropdown ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={colors.textSecondary}
                  style={{ position: 'absolute', right: 10 }}
                />
              </TouchableOpacity>
              
              {showCartaoDropdown && (
                <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  {cartoes.map((cartao) => (
                    <TouchableOpacity
                      key={cartao.id}
                      style={[
                        styles.dropdownItem,
                        { borderBottomWidth: 1, borderBottomColor: colors.border },
                        cartaoSelecionado === cartao.id && { backgroundColor: colors.primary + '20' }
                      ]}
                      onPress={() => {
                        setCartaoSelecionado(cartao.id);
                        setShowCartaoDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownText, { color: colors.text }]}>
                        {cartao.nome}
                        {cartao.ultimos_4_digitos && ` •••• ${cartao.ultimos_4_digitos}`}
                        {cartao.bandeira && ` (${cartao.bandeira})`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      { 
                        borderTopWidth: 1, 
                        borderTopColor: colors.border,
                        marginTop: spacing.xs,
                        paddingTop: spacing.md,
                        flexDirection: 'row',
                        alignItems: 'center'
                      }
                    ]}
                    onPress={() => {
                      setShowCartaoDropdown(false);
                      router.push('/cadastrar-cartao');
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                    <Text style={[styles.dropdownText, { color: colors.primary, fontWeight: '600' }]}>
                      Cadastrar Novo Cartão
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Data de Vencimento */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Data de Vencimento</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY (opcional)"
              value={dataVencimentoDisplay}
              onChangeText={handleDataVencimentoChange}
              keyboardType="numeric"
              maxLength={10}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Paga */}
          <View style={styles.fieldContainer}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setPaga(!paga)}
            >
              <View style={[
                styles.checkbox,
                paga && styles.checkboxChecked
              ]}>
                {paga && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>Despesa já foi paga</Text>
            </TouchableOpacity>
          </View>

          {/* Data de Pagamento (se paga) */}
          {paga && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Data de Pagamento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={dataPagamentoDisplay}
                onChangeText={handleDataPagamentoChange}
                keyboardType="numeric"
                maxLength={10}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          )}

          {/* Observação */}
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

          {/* Botão Salvar */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Salvando...' : 'Salvar Despesa'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <NewCategoryModal
        visible={showNewCategoryModal}
        onClose={() => setShowNewCategoryModal(false)}
        onSave={saveCustomCategory}
        type="despesa"
      />

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />

      <CartaoModal
        visible={showCartaoModal}
        onClose={() => setShowCartaoModal(false)}
        onCadastrar={handleCadastrarCartao}
      />
    </SafeAreaView>
  );
}

