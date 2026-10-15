/**
 * Pulse Pay — design tokens from reference video frames.
 * Original demo fintech UI. Not affiliated with any bank.
 */

export const colors = {
  bg: '#0B0B0D',
  bgElevated: '#141416',
  bgCard: '#1A1A1E',
  bgSheet: '#FFFFFF',
  bgSheetMuted: '#F5F5F7',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.35)',
  textDark: '#111111',
  textDarkSecondary: '#6B6B70',
  textDarkMuted: '#9A9AA0',

  accentGreen: '#22C55E',
  success: '#00E676',
  successBg: '#00C853',
  danger: '#EF4444',
  income: '#16A34A',

  cardYellow: '#F5E74A',
  cardMint: '#3DDFB0',
  cardBlue: '#3B82F6',
  cardPurple: '#8B5CF6',

  border: 'rgba(255,255,255,0.08)',
  borderDark: 'rgba(0,0,0,0.06)',
  pill: 'rgba(255,255,255,0.1)',
  pillDark: '#F0F0F2',
  overlay: 'rgba(0,0,0,0.45)',
  demoBanner: '#F59E0B',
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
  xl: 24,
  xxl: 28,
  full: 999,
  card: 22,
  sheet: 28,
  button: 999,
  key: 16,
} as const;

export const typography = {
  balance: { fontSize: 48, fontWeight: '700' as const, letterSpacing: -1.2 },
  amountLarge: { fontSize: 56, fontWeight: '600' as const, letterSpacing: -1.5 },
  title: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  section: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '500' as const },
  label: { fontSize: 14, fontWeight: '600' as const },
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const animation = {
  fast: 180,
  normal: 280,
  slow: 420,
  success: 500,
} as const;

export const layout = {
  screenPadding: 20,
  bottomNavHeight: 72,
  cardWidth: 280,
  cardHeight: 168,
  avatarSize: 64,
  keySize: 72,
} as const;
