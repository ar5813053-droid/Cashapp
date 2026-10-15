import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { layout, radii } from '../design/tokens';

type Props = {
  merchant: string;
  size?: number;
};

/** Offline brand-style marks — not official trademark assets; recognizable silhouettes only. */
export function MerchantLogo({ merchant, size = layout.iconBox }: Props) {
  const key = merchant.toLowerCase();
  let bg = '#1A1A1A';
  let icon: keyof typeof Ionicons.glyphMap = 'storefront-outline';
  let color = '#fff';
  let letter: string | null = null;

  if (key.includes('apple')) {
    bg = '#000000';
    icon = 'logo-apple';
  } else if (key.includes('thread')) {
    bg = '#000000';
    icon = 'at';
  } else if (key.includes('exoplan')) {
    bg = '#16A34A';
    letter = 'E';
  } else if (key.includes('cafe') || key.includes('coffee')) {
    bg = '#B45309';
    icon = 'cafe-outline';
  } else if (key.includes('transfer') || key.includes('sent') || key.includes('received')) {
    bg = '#3B82F6';
    icon = 'swap-horizontal';
  } else {
    letter = merchant.trim().charAt(0).toUpperCase() || '?';
    bg = '#374151';
  }

  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      {letter ? (
        <Text style={[styles.letter, { fontSize: size * 0.4 }]}>{letter}</Text>
      ) : (
        <Ionicons name={icon} size={size * 0.48} color={color} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: '#fff',
    fontWeight: '700',
  },
});
