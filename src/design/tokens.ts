export const colors = {
  bg: '#050508',
  bgElevated: '#0E0E12',
  bgCard: '#16161A',
  bgSheet: '#FFFFFF',
  bgSheetMuted: '#F3F3F6',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.58)',
  textMuted: 'rgba(255,255,255,0.36)',
  textDark: '#111114',
  textDarkSecondary: '#6B6B74',
  textDarkMuted: '#9A9AA3',

  accentGreen: '#22C55E',
  success: '#00E676',
  successBg: '#00C853',
  danger: '#EF4444',
  income: '#16A34A',

  cardYellow: '#F5E74A',
  cardMint: '#3DDFB0',
  cardBlue: '#3B82F6',

  heroBlue: '#1B3A8C',
  heroCyan: '#2B6CFF',
  heroGlow: '#4A7CFF',

  border: 'rgba(255,255,255,0.08)',
  pill: 'rgba(255,255,255,0.14)',
  pillDark: '#ECECF0',
  navDark: '#121214',
  navActive: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.45)',
  warning: '#F59E0B',
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40,
} as const;

export const radii = {
  sm: 10, md: 14, lg: 18, xl: 22, xxl: 28, full: 999, card: 22, sheet: 28, button: 999, key: 16,
} as const;

export const typography = {
  balance: { fontSize: 48, fontWeight: '700' as const, letterSpacing: -1.6 },
  amountLarge: { fontSize: 56, fontWeight: '700' as const, letterSpacing: -1.6 },
  title: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  section: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '500' as const },
  label: { fontSize: 14, fontWeight: '600' as const },
} as const;

export const animation = { fast: 160, normal: 280, slow: 420, success: 500 } as const;

export const layout = {
  screenPadding: 20,
  bottomNavHeight: 58,
  bottomNavMargin: 14,
  avatarSize: 56,
  keySize: 68,
  buttonHeight: 48,
  iconBox: 40,
} as const;
