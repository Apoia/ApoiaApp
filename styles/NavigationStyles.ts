import { StyleSheet } from 'react-native';
import { ThemeColors, borderRadius, shadows, spacing } from './theme';

export const createNavigationStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md + 4, 
    ...shadows.medium,
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    flex: 1,
    minWidth: 70,
    maxWidth: 100,
  },
  tabIcon: {
    marginBottom: 2,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
    numberOfLines: 1,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabLabelInactive: {
    color: colors.textSecondary,
  },
});
