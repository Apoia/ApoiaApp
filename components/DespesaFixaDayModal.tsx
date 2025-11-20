import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { borderRadius, shadows, spacing } from '../styles/theme';

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

interface DespesaFixaDayModalProps {
  visible: boolean;
  onClose: () => void;
  day: number | null;
  despesas: DespesaFixa[];
}

export default function DespesaFixaDayModal({ 
  visible, 
  onClose, 
  day, 
  despesas 
}: DespesaFixaDayModalProps) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 500;
  const modalWidth = isSmallScreen ? width - 32 : Math.min(600, width - 64);
  const modalHeight = height * 0.85;
  const styles = createStyles(colors, modalWidth, modalHeight, isSmallScreen);

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

  const getFormaPagamentoIcon = (forma: string) => {
    const icons: { [key: string]: string } = {
      'dinheiro': 'cash',
      'pix': 'flash',
      'debito': 'card',
      'credito': 'card',
      'outro': 'ellipsis-horizontal'
    };
    return icons[forma] || 'card';
  };

  const totalDespesas = despesas.reduce((sum, despesa) => sum + despesa.valor, 0);

  if (!visible || day === null) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerIconWrapper}>
                <View style={styles.headerIconCircle}>
                  <Ionicons name="calendar" size={32} color={colors.primary} />
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Dia {day}</Text>
              <Text style={styles.headerSubtitle}>
                {despesas.length} {despesas.length === 1 ? 'despesa fixa' : 'despesas fixas'}
              </Text>
              {despesas.length > 0 && (
                <View style={styles.totalBadge}>
                  <Text style={styles.totalLabel}>Total: </Text>
                  <Text style={styles.totalValue}>{formatCurrency(totalDespesas)}</Text>
                </View>
              )}
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {despesas.map((despesa) => (
              <View key={despesa.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconWrapper}>
                    <Ionicons name="receipt" size={28} color={colors.error} />
                  </View>
                  <View style={styles.cardTitleSection}>
                    <Text style={styles.cardTitle}>{despesa.descricao}</Text>
                    <Text style={styles.cardValue}>{formatCurrency(despesa.valor)}</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Ionicons name="time" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Vencimento</Text>
                      <Text style={styles.detailValue}>Todo dia {despesa.dia_vencimento}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Ionicons name={getFormaPagamentoIcon(despesa.forma_pagamento) as any} size={20} color={colors.warning} />
                    </View>
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Forma de Pagamento</Text>
                      <Text style={styles.detailValue}>{getFormaPagamentoLabel(despesa.forma_pagamento)}</Text>
                      {despesa.cartao && (
                        <View style={styles.cartaoRow}>
                          <Ionicons name="card" size={16} color={colors.textSecondary} />
                          <Text style={styles.cartaoText}>
                            {despesa.cartao.nome}
                            {despesa.cartao.ultimos_4_digitos ? ` ****${despesa.cartao.ultimos_4_digitos}` : ''}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {despesa.categoria && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <Ionicons name="pricetag" size={20} color={colors.success} />
                      </View>
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Categoria</Text>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>{despesa.categoria}</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {despesa.observacao && (
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <Ionicons name="document-text" size={20} color={colors.textSecondary} />
                      </View>
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Observação</Text>
                        <Text style={styles.detailValue}>{despesa.observacao}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any, modalWidth: number, modalHeight: number, isSmallScreen: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: modalWidth,
    height: modalHeight,
    backgroundColor: colors.surface,
    borderRadius: 24,
    ...shadows.large,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.primary + '08',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerIconWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  headerIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    gap: spacing.xs,
  },
  totalLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 22,
    color: colors.error,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardTitleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.error,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  cardDetails: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 22,
  },
  cartaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  cartaoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryBadge: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
});
