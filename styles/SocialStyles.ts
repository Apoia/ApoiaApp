import { StyleSheet } from 'react-native';
import { ThemeColors, shadows, spacing, typography } from './theme';

export const createSocialStyles = (colors: ThemeColors) => StyleSheet.create({
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
  },
  placeholder: {
    width: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  profileImageContainer: {
    marginRight: spacing.lg,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  profileInitial: {
    ...typography.h2,
    fontWeight: '700',
    color: colors.accent,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  followersText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingTop: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
