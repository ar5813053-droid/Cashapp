/**
 * Pulse Pay design system — refined for compact premium fintech UI.
 */

export const colors = {
  bg: '#0A0A0C',
  bgElevated: '#121214',
  bgCard: '#1C1C1F',
  bgSheet: '#FFFFFF',
  bgSheetMuted: '#F4F4F6',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.58)',
  textMuted: 'rgba(255,255,255,0.38)',
  textDark: '#0F0F12',
  textDarkSecondary: '#5C5C66',
  textDarkMuted: '#8E8E98',

  accentGreen: '#22C55E',
  success: '#00E676',
  successBg: '#00C853',
  danger: '#EF4444',
  income: '#16A34A',
  outgoing: '#0F0F12',

  cardYellow: '#F5E74A',
  cardMint: '#3DDFB0',
  cardBlue: '#3B82F6',
  cardPurple: '#8B5CF6',

  border: 'rgba(255,255,255,0.08)',
  borderDark: 'rgba(0,0,0,0.06)',
  pill: 'rgba(255,255,255,0.12)',
  pillDark: '#ECECF0',
  overlay: 'rgba(0,0,0,0.5)',
  accent: '#3B82F6',
  warning: '#F59E0B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 999,
  card: 20,
  sheet: 24,
  button: 999,
  key: 14,
} as const;

export const typography = {
  balance: { fontSize: 44, fontWeight: '700' as const, letterSpacing: -1.4 },
  amountLarge: { fontSize: 52, fontWeight: '600' as const, letterSpacing: -1.4 },
  title: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.4 },
  section: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '500' as const },
  label: { fontSize: 14, fontWeight: '600' as const },
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
} as const;

export const animation = {
  fast: 160,
  normal: 260,
  slow: 400,
  success: 480,
} as const;

export const layout = {
  screenPadding: 20,
  /** Compact floating tab bar */
  bottomNavHeight: 56,
  bottomNavMargin: 12,
  cardWidth: 280,
  cardHeight: 168,
  avatarSize: 56,
  keySize: 64,
  buttonHeight: 48,
  iconBox: 40,
} as const;
