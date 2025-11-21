import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import CartaoModal from '../components/CartaoModal'
import CustomAlert from '../components/CustomAlert'
import NewCategoryModal from '../components/NewCategoryModal'
import { useTheme } from '../contexts/ThemeContext'
import { createAddDespesaStyles } from '../styles/AddDespesaStyles'
import { spacing } from '../styles/theme'
import apiService from '../utils/apiService'
import { formatCurrencyInput, parseCurrency } from '../utils/masks'

interface Cartao {
  id: number
  nome: string
  ultimos_4_digitos?: string
  bandeira?: string
}

export default function CadastrarDespesaFixaScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const styles = createAddDespesaStyles(colors)

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
    visible: false,
    type: 'error' as 'success' | 'error' | 'warning',
    title: '',
    message: ''
  })

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [valorDisplay, setValorDisplay] = useState('')
  const [categoria, setCategoria] = useState('')
  const [diaVencimento, setDiaVencimento] = useState('')
  const [formaPagamento, setFormaPagamento] = useState<
    'dinheiro' | 'pix' | 'debito' | 'credito' | 'outro'
  >('pix')
  const [cartoes, setCartoes] = useState<Cartao[]>([])
  const [cartaoSelecionado, setCartaoSelecionado] = useState<number | null>(null)
  const [showCartaoModal, setShowCartaoModal] = useState(false)
  const [showCartaoDropdown, setShowCartaoDropdown] = useState(false)
  const [showCategorias, setShowCategorias] = useState(false)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [observacao, setObservacao] = useState('')

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
  ]

  const categoriasDespesa = [...categoriasDespesaBase, ...customCategories]

  useFocusEffect(
    useCallback(() => {
      loadCartoes()
      loadCustomCategories()
    }, [])
  )

  const loadCustomCategories = async () => {
    try {
      const stored = await AsyncStorage.getItem('customCategories_despesa')
      if (stored) {
        setCustomCategories(JSON.parse(stored))
      }
    } catch (error) {
      setCustomCategories([])
    }
  }

  const saveCustomCategory = async (categoryName: string) => {
    try {
      const updated = [...customCategories, categoryName]
      setCustomCategories(updated)
      await AsyncStorage.setItem('customCategories_despesa', JSON.stringify(updated))
      setCategoria(categoryName)
      if (!descricao.trim()) {
        setDescricao(categoryName)
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: 'Erro ao salvar categoria'
      })
    }
  }

  const loadCartoes = async () => {
    try {
      const response = await apiService.get<{ success: boolean; data?: Cartao[] }>('/cartoes')
      if (response.success && response.data) {
        setCartoes(response.data)
      }
    } catch (error) {
      setCartoes([])
    }
  }

  const handleValorChange = (text: string) => {
    const formatted = formatCurrencyInput(text)
    setValorDisplay(formatted)
    setValor(String(parseCurrency(formatted)))
  }

  const handleDiaVencimentoChange = (text: string) => {
    const numeric = text.replace(/\D/g, '')
    if (numeric.length <= 2) {
      setDiaVencimento(numeric)
    }
  }

  const handleFormaPagamentoPress = async (
    forma: 'dinheiro' | 'pix' | 'debito' | 'credito' | 'outro'
  ) => {
    if (forma === 'credito' || forma === 'debito') {
      if (cartoes.length === 0) {
        setShowCartaoModal(true)
        return
      }
      setFormaPagamento(forma)
      setShowCartaoDropdown(true)
    } else {
      setFormaPagamento(forma)
      setCartaoSelecionado(null)
      setShowCartaoDropdown(false)
    }
  }

  const handleCadastrarCartao = () => {
    setShowCartaoModal(false)
    router.push('/cadastrar-cartao')
  }

  const handleCategoriaSelect = (cat: string) => {
    if (cat === 'Outros...') {
      setShowCategorias(false)
      setShowNewCategoryModal(true)
      return
    }

    if (categoria === cat) {
      setCategoria('')
    } else {
      setCategoria(cat)
      if (!descricao.trim()) {
        setDescricao(cat)
      }
    }
    setShowCategorias(false)
  }

  const handleClose = () => {
    router.back()
  }

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha a descrição'
      })
      return
    }

    const valorNumero = parseCurrency(valorDisplay)
    if (!valorDisplay || valorNumero <= 0) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha um valor válido'
      })
      return
    }

    const dia = parseInt(diaVencimento)
    if (!diaVencimento || dia < 1 || dia > 31) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha o dia de vencimento (1-31)'
      })
      return
    }

    if ((formaPagamento === 'credito' || formaPagamento === 'debito') && !cartaoSelecionado) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Selecione um cartão'
      })
      return
    }

    setLoading(true)

    try {
      const data: any = {
        descricao: descricao.trim(),
        valor: valorNumero,
        categoria: categoria.trim() || null,
        dia_vencimento: dia,
        forma_pagamento: formaPagamento,
        observacao: observacao.trim() || null
      }

      if (cartaoSelecionado) {
        data.cartao_id = cartaoSelecionado
      }

      const response = await apiService.post('/despesas-fixas', data)

      if (response.success) {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Sucesso!',
          message: 'Despesa fixa cadastrada com sucesso'
        })

        setTimeout(() => {
          router.back()
        }, 1500)
      } else {
        setAlert({
          visible: true,
          type: 'error',
          title: 'Erro',
          message: response.message || 'Erro ao cadastrar despesa fixa'
        })
      }
    } catch (error: any) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Erro',
        message: error.response?.data?.message || 'Erro ao conectar com o servidor'
      })
    } finally {
      setLoading(false)
    }
  }

  const formasPagamento = [
    { value: 'dinheiro', label: 'Dinheiro', icon: 'cash' },
    { value: 'pix', label: 'PIX', icon: 'flash' },
    { value: 'debito', label: 'Débito', icon: 'card' },
    { value: 'credito', label: 'Crédito', icon: 'card-outline' },
    { value: 'outro', label: 'Outro', icon: 'ellipsis-horizontal' }
  ]

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
          <Text style={styles.headerTitle}>Nova Despesa Fixa</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoSection}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              Despesas fixas são contas que se repetem todo mês. Você receberá lembretes e ganhará
              pontos ao pagar em dia!
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Conta de Água, Aluguel..."
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
              style={[
                styles.input,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
              ]}
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
                      <Text
                        style={[
                          styles.dropdownText,
                          categoria === cat && styles.dropdownTextSelected
                        ]}
                      >
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
                      {
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                        marginTop: spacing.xs,
                        paddingTop: spacing.md
                      }
                    ]}
                    onPress={() => handleCategoriaSelect('Outros...')}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={colors.primary}
                      style={{ marginRight: spacing.sm }}
                    />
                    <Text
                      style={[styles.dropdownText, { color: colors.primary, fontWeight: '600' }]}
                    >
                      Outros...
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dia de Vencimento *</Text>
            <View style={styles.dayInputContainer}>
              <TextInput
                style={styles.dayInput}
                placeholder="10"
                value={diaVencimento}
                onChangeText={handleDiaVencimentoChange}
                keyboardType="numeric"
                maxLength={2}
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.dayLabel}>do mês</Text>
            </View>
            <Text style={styles.helperText}>Digite o dia do mês em que a conta vence (1-31)</Text>
          </View>

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
                  <Text
                    style={[
                      styles.optionText,
                      formaPagamento === forma.value && styles.optionTextSelected
                    ]}
                  >
                    {forma.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {(formaPagamento === 'credito' || formaPagamento === 'debito') &&
              showCartaoDropdown &&
              cartoes.length > 0 && (
                <View style={styles.dropdown}>
                  {cartoes.map((cartao, index) => (
                    <TouchableOpacity
                      key={cartao.id}
                      style={[
                        styles.dropdownItem,
                        cartaoSelecionado === cartao.id && styles.dropdownItemSelected,
                        { borderBottomWidth: 1, borderBottomColor: colors.border }
                      ]}
                      onPress={() => {
                        setCartaoSelecionado(cartao.id)
                        setShowCartaoDropdown(false)
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownText,
                          cartaoSelecionado === cartao.id && styles.dropdownTextSelected
                        ]}
                      >
                        {cartao.nome}{' '}
                        {cartao.ultimos_4_digitos ? `****${cartao.ultimos_4_digitos}` : ''}
                      </Text>
                      {cartaoSelecionado === cartao.id && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      )}
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
                        alignItems: 'center',
                        borderBottomWidth: 0
                      }
                    ]}
                    onPress={() => {
                      setShowCartaoDropdown(false)
                      router.push('/cadastrar-cartao')
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={colors.primary}
                      style={{ marginRight: spacing.sm }}
                    />
                    <Text
                      style={[styles.dropdownText, { color: colors.primary, fontWeight: '600' }]}
                    >
                      Cadastrar Novo Cartão
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Observação</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observações adicionais..."
              value={observacao}
              onChangeText={setObservacao}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Salvando...' : 'Cadastrar Despesa Fixa'}
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

      <CartaoModal
        visible={showCartaoModal}
        onClose={() => setShowCartaoModal(false)}
        onCadastrar={handleCadastrarCartao}
      />

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </SafeAreaView>
  )
}
