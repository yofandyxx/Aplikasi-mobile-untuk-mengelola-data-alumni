export const COLORS = {
  primary: '#0B1F3A',
  primaryLight: '#1A3A5C',
  accent: '#2F80ED',
  success: '#27AE60',
  warning: '#F2994A',
  purple: '#9B51E0',
  danger: '#EB5757',

  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F7',

  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnDark: '#FFFFFF',

  border: '#E5E7EB',
  borderLight: '#F0F2F5',

  badgeBekerja: '#E3F2FD',
  badgeBekerjaText: '#1565C0',
  badgeWirausaha: '#EDE7F6',
  badgeWirausahaText: '#6A1B9A',
  badgeStudi: '#E8F5E9',
  badgeStudiText: '#2E7D32',
  badgeBelum: '#FFF3E0',
  badgeBelumText: '#E65100',

  chart: ['#0B1F3A', '#2F80ED', '#27AE60', '#9B51E0', '#F2994A'],
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const FONT = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: COLORS.text },
  h2: { fontSize: 22, fontWeight: '700' as const, color: COLORS.text },
  h3: { fontSize: 18, fontWeight: '700' as const, color: COLORS.text },
  body: { fontSize: 14, fontWeight: '400' as const, color: COLORS.text },
  bodyMedium: { fontSize: 14, fontWeight: '600' as const, color: COLORS.text },
  caption: { fontSize: 12, fontWeight: '400' as const, color: COLORS.textSecondary },
  statNumber: { fontSize: 30, fontWeight: '800' as const, color: COLORS.text },
} as const;