import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography } from '../design/tokens';

/** Always-visible label that this is demo UI only. */
export function DemoBanner({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <Text style={styles.text}>DEMO · NOT REAL MONEY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.demoBanner,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    alignSelf: 'center',
  },
  compact: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  text: {
    ...typography.micro,
    color: '#111',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
