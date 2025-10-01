import { StyleSheet } from 'react-native';
import { ThemeColors, borderRadius, shadows, spacing } from './theme';

export const createProfileStyles = (colors: ThemeColors) => StyleSheet.create({
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
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
  userSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  userLevel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  achievementsSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  achievementsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  achievementsList: {
    gap: spacing.lg,
  },
  settingsSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  settingsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  settingsList: {
    gap: spacing.sm,
  },
  logoutSection: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  logoutButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg + 6,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.large,
    borderWidth: 0,
    minHeight: 56,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
    marginLeft: spacing.sm,
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});