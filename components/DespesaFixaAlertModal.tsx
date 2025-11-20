import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { borderRadius, shadows, spacing, typography } from '../styles/theme';

interface DespesaFixa {
  id: number;
  descricao: string;
  valor: number;
  dia_vencimento: number;
}

interface DespesaFixaAlertModalProps {
  visible: boolean;
  despesa: DespesaFixa | null;
  isVencida?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onLater: () => void;
  onNaoPaguei?: () => void;
}

export default function DespesaFixaAlertModal({
  visible,
  despesa,
  isVencida = false,
  onConfirm,
  onCancel,
  onLater,
  onNaoPaguei
}: DespesaFixaAlertModalProps) {
  const { colors } = useTheme();

  if (!despesa) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.iconContainer}>
            <Ionicons name={isVencida ? "warning" : "alert-circle"} size={60} color={isVencida ? colors.error : colors.warning} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            {isVencida ? 'Despesa Vencida!' : 'Despesa Vencendo Hoje!'}
          </Text>
          
          <View style={[styles.despesaInfo, { backgroundColor: colors.background }]}>
            <Text style={[styles.despesaNome, { color: colors.text }]}>
              {despesa.descricao}
            </Text>
            <Text style={[styles.despesaValor, { color: colors.primary }]}>
              {formatCurrency(despesa.valor)}
            </Text>
            <Text style={[styles.despesaVencimento, { color: colors.textSecondary }]}>
              Vencimento: Dia {despesa.dia_vencimento}
            </Text>
          </View>
          
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {isVencida 
              ? 'Esta despesa já venceu e ainda não foi paga. Você já pagou?' 
              : 'Você já pagou esta despesa?'}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.buttonConfirm, { backgroundColor: colors.success }]} 
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.buttonText}>Sim, já paguei</Text>
            </TouchableOpacity>
            
            {onNaoPaguei && (
              <TouchableOpacity 
                style={[styles.buttonNaoPaguei, { backgroundColor: colors.error + '15', borderColor: colors.error }]} 
                onPress={onNaoPaguei}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={20} color={colors.error} />
                <Text style={[styles.buttonTextNaoPaguei, { color: colors.error }]}>Não paguei ainda</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.buttonLater, { borderColor: colors.border }]} 
              onPress={onLater}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonTextLater, { color: colors.text }]}>Lembrar depois</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.buttonCancel, { borderColor: colors.border }]} 
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonTextCancel, { color: colors.textSecondary }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    ...shadows.large,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  despesaInfo: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  despesaNome: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  despesaValor: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  despesaVencimento: {
    fontSize: 14,
    fontWeight: '500',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  buttonConfirm: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...shadows.medium,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonLater: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  buttonTextLater: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonCancel: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonTextCancel: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonNaoPaguei: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 8,
  },
  buttonTextNaoPaguei: {
    fontSize: 16,
    fontWeight: '600',
  },
});

