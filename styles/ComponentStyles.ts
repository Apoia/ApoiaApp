import { StyleSheet } from 'react-native';
import { ThemeColors, borderRadius, shadows, spacing } from './theme';

export const createComponentStyles = (colors: ThemeColors) => StyleSheet.create({
  
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  progressBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  progressBadgeText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },

  
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContent: {
    gap: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryValuePositive: {
    color: colors.success,
  },
  summaryValueNegative: {
    color: colors.error,
  },

  
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  goalCardCompleted: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success + '30',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  goalTitleText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  goalTitleCompleted: {
    color: colors.success,
  },
  goalType: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pointsContainer: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.warning,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  goalDescriptionCompleted: {
    color: colors.success,
  },
  goalProgress: {
    marginTop: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  goalsList: {
    maxHeight: 200,
  },
  goalCardContainer: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalCardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  goalCardInfo: {
    flex: 1,
  },
  goalCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  goalCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  goalCardProgress: {
    marginTop: spacing.sm,
  },
  goalCardProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  goalCardProgressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  goalCardProgressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  goalCardProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalCardProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  individualGoalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border,
  },
  individualGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  individualGoalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  individualGoalEmoji: {
    fontSize: 24,
  },
  individualGoalInfo: {
    flex: 1,
  },
  individualGoalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  individualGoalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  individualGoalProgress: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  individualGoalProgressContainer: {
    marginTop: spacing.sm,
  },
  individualGoalProgressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  individualGoalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  individualGoalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  individualGoalCurrent: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  individualGoalTarget: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  goalCardContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    maxWidth: 400,
  },
  goalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  goalCardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  goalCardInfo: {
    flex: 1,
    alignItems: 'center',
  },
  goalCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  goalCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  goalCardProgress: {
    width: '100%',
    marginTop: spacing.lg,
  },
  goalCardProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  goalCardProgressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  goalCardProgressValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  goalCardProgressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalCardProgressFill: {
    height: '100%',
    borderRadius: 4,
  },

  
  socialPost: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  socialPostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  socialPostAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  socialPostUserInfo: {
    flex: 1,
  },
  socialPostUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  socialPostTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  socialPostContent: {
    padding: spacing.lg,
  },
  socialPostActivity: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  socialPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  socialPostAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialPostActionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },

  
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
    ...shadows.large,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.info + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContent: {
    gap: spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.sm,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    marginBottom: spacing.md,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },

  
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  settingInfo: {
    flex: 1,
  } as any,
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  settingAction: {
    padding: spacing.sm,
  },
});