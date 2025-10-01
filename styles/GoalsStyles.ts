import { StyleSheet } from 'react-native';
import { ThemeColors, borderRadius, shadows, spacing, typography } from './theme';

export const createGoalsStyles = (colors: ThemeColors) => StyleSheet.create({
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
    ...shadows.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.warning,
    ...shadows.small,
  },
  pointsText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.warning,
    marginLeft: spacing.xs,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  welcomeSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  welcomeTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  subsection: {
    marginBottom: 32,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subsectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  subsectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  subsectionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  goalsList: {
    width: '100%',
    alignItems: 'center',
  },
  motivationSection: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  motivationCard: {
    backgroundColor: colors.warning + '20',
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.warning,
    ...shadows.medium,
  },
  motivationTitle: {
    ...typography.h3,
    color: colors.warning,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  motivationText: {
    ...typography.caption,
    color: colors.warning,
    textAlign: 'center',
    lineHeight: 20,
  },
});
