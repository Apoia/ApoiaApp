import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
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
import CustomAlert from '../components/CustomAlert'
import { useTheme } from '../contexts/ThemeContext'
import { createAddDespesaStyles } from '../styles/AddDespesaStyles'
import { spacing } from '../styles/theme'
import apiService from '../utils/apiService'
import { formatCurrencyInput, parseCurrency } from '../utils/masks'

export default function CadastrarCartaoScreen() {
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

  const [nome, setNome] = useState('')
  const [ultimos4Digitos, setUltimos4Digitos] = useState('')
  const [bandeira, setBandeira] = useState('')
  const [showBandeiraDropdown, setShowBandeiraDropdown] = useState(false)
  const [limiteTotal, setLimiteTotal] = useState('')
  const [limiteTotalDisplay, setLimiteTotalDisplay] = useState('')
  const [diaVencimento, setDiaVencimento] = useState('')

  const handleClose = () => {
    router.back()
  }

  const handleLimiteChange = (text: string) => {
    const formatted = formatCurrencyInput(text)
    setLimiteTotalDisplay(formatted)
    setLimiteTotal(String(parseCurrency(formatted)))
  }

  const handleUltimos4Change = (text: string) => {
    const numbers = text.replace(/[^\d]/g, '')
    if (numbers.length <= 4) {
      setUltimos4Digitos(numbers)
    }
  }

  const handleDiaVencimentoChange = (text: string) => {
    const numbers = text.replace(/[^\d]/g, '')
    if (numbers.length <= 2) {
      const day = parseInt(numbers) || 0
      if (day >= 1 && day <= 31) {
        setDiaVencimento(numbers)
      } else if (numbers === '') {
        setDiaVencimento('')
      }
    }
  }

  const BANDEIRAS_IMAGES = {
    Visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
    Mastercard:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/960px-Mastercard-logo.svg.png',
    Elo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Elo_logo.png',
    Hipercard:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Hipercard_logo.svg/2000px-Hipercard_logo.svg.png'
  }

  const bandeiras = [
    { value: 'Visa', label: 'Visa' },
    { value: 'Mastercard', label: 'Mastercard' },
    { value: 'Elo', label: 'Elo' },
    { value: 'Hipercard', label: 'Hipercard' }
  ]

  const handleBandeiraSelect = (bandeiraValue: string) => {
    setBandeira(bandeiraValue)
    setShowBandeiraDropdown(false)
  }

  const handleSubmit = async () => {
    if (!nome.trim()) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Atenção',
        message: 'Preencha o nome do cartão'
      })
      return
    }

    setLoading(true)

    try {
      const data: any = {
        nome: nome.trim(),
        bandeira: bandeira.trim() || null,
        limite_total: limiteTotalDisplay ? parseCurrency(limiteTotalDisplay) : null,
        dia_vencimento: diaVencimento ? parseInt(diaVencimento) : null
      }

      if (ultimos4Digitos) {
        data.ultimos_4_digitos = ultimos4Digitos
      }

      const response = await apiService.post('/cartoes', data)

      if (response.success) {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Sucesso!',
          message: 'Cartão cadastrado com sucesso'
        })

        setTimeout(() => {
          router.back()
        }, 1500)
      } else {
        setAlert({
          visible: true,
          type: 'error',
          title: 'Erro',
          message: response.message || 'Erro ao cadastrar cartão'
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
          <Text style={styles.headerTitle}>Cadastrar Cartão</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nome do Cartão *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cartão Nubank, Cartão Itaú..."
              value={nome}
              onChangeText={setNome}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Últimos 4 dígitos</Text>
            <TextInput
              style={styles.input}
              placeholder="0000"
              value={ultimos4Digitos}
              onChangeText={handleUltimos4Change}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bandeira</Text>
            <TouchableOpacity
              style={[
                styles.input,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
              ]}
              onPress={() => setShowBandeiraDropdown(!showBandeiraDropdown)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {bandeira && BANDEIRAS_IMAGES[bandeira as keyof typeof BANDEIRAS_IMAGES] ? (
                  <>
                    <View
                      style={{
                        width: 50,
                        height: 30,
                        marginRight: spacing.sm,
                        justifyContent: 'center'
                      }}
                    >
                      <Image
                        source={{
                          uri: BANDEIRAS_IMAGES[bandeira as keyof typeof BANDEIRAS_IMAGES]
                        }}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                        contentFit="contain"
                        recyclingKey={bandeira}
                      />
                    </View>
                    <Text style={[styles.inputText, { color: colors.text }]}>{bandeira}</Text>
                  </>
                ) : (
                  <Text style={[styles.inputText, { color: colors.textSecondary }]}>
                    Selecione uma bandeira...
                  </Text>
                )}
              </View>
              <Ionicons
                name={showBandeiraDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {showBandeiraDropdown && (
              <View
                style={[
                  styles.dropdown,
                  { backgroundColor: colors.surface, borderColor: colors.border }
                ]}
              >
                <ScrollView
                  style={styles.dropdownScroll}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  {bandeiras.map((bandeiraOption, index) => (
                    <TouchableOpacity
                      key={bandeiraOption.value}
                      style={[
                        styles.dropdownItem,
                        {
                          borderBottomWidth: index !== bandeiras.length - 1 ? 1 : 0,
                          borderBottomColor: colors.border
                        },
                        bandeira === bandeiraOption.value && {
                          backgroundColor: colors.primary + '20'
                        }
                      ]}
                      onPress={() => handleBandeiraSelect(bandeiraOption.value)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View
                          style={{
                            width: 60,
                            height: 36,
                            marginRight: spacing.md,
                            justifyContent: 'center'
                          }}
                        >
                          <Image
                            source={{
                              uri: BANDEIRAS_IMAGES[
                                bandeiraOption.value as keyof typeof BANDEIRAS_IMAGES
                              ]
                            }}
                            style={{
                              width: '100%',
                              height: '100%'
                            }}
                            contentFit="contain"
                            recyclingKey={bandeiraOption.value}
                          />
                        </View>
                        <Text
                          style={[
                            styles.dropdownText,
                            { color: colors.text },
                            bandeira === bandeiraOption.value && {
                              fontWeight: '600',
                              color: colors.primary
                            }
                          ]}
                        >
                          {bandeiraOption.label}
                        </Text>
                      </View>
                      {bandeira === bandeiraOption.value && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Limite Total</Text>
            <View style={styles.currencyContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.currencyInput}
                placeholder="0,00"
                value={limiteTotalDisplay}
                onChangeText={handleLimiteChange}
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dia de Vencimento</Text>
            <TextInput
              style={styles.input}
              placeholder="1-31"
              value={diaVencimento}
              onChangeText={handleDiaVencimentoChange}
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>{loading ? 'Salvando...' : 'Salvar Cartão'}</Text>
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
  )
}
