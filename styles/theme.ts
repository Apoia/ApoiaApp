export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  accent: string;
}

export const lightTheme: ThemeColors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  primary: '#4A90E2',
  secondary: '#6B7280',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  shadow: '#000000',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  accent: '#FF6B35',
};

export const darkTheme: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  primary: '#60A5FA',
  secondary: '#9CA3AF',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#374151',
  shadow: '#000000',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  accent: '#FF8C42',
};

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  headerTop: number;
  headerBottom: number;
}

export const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  
  headerTop: 28, 
  headerBottom: 20, 
};

export interface ThemeTypography {
  h1: { fontSize: number; fontWeight: string };
  h2: { fontSize: number; fontWeight: string };
  h3: { fontSize: number; fontWeight: string };
  body: { fontSize: number; fontWeight: string };
  caption: { fontSize: number; fontWeight: string };
  small: { fontSize: number; fontWeight: string };
}

export const typography: ThemeTypography = {
  h1: { fontSize: 28, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '700' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
};

export interface ThemeShadows {
  small: object;
  medium: object;
  large: object;
}

export const shadows: ThemeShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
};

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export const borderRadius: ThemeBorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};
