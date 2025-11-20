import { StyleSheet } from 'react-native';
import { ThemeColors, borderRadius, shadows, spacing, typography } from './theme';

export const createAddStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.headerTop, 
    paddingBottom: spacing.headerBottom,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
    fontWeight: '700',
    fontSize: 20,
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  titleSection: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionsGrid: {
    gap: spacing.lg,
  },
  optionCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 2,
    ...shadows.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.small,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  optionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  arrowIcon: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
});
