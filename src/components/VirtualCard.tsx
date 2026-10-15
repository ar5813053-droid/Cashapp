import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { VirtualCard } from '../types';
import { colors, spacing, radii, typography } from '../design/tokens';
import { PressableScale } from './PressableScale';

type Props = {
  card: VirtualCard;
  width?: number;
  height?: number;
  showActions?: boolean;
  onToggleFreeze?: () => void;
};

function glowColor(c: string) {
  if (c === colors.cardYellow) return 'rgba(245,231,74,0.45)';
  if (c === colors.cardMint) return 'rgba(61,223,176,0.45)';
  return 'rgba(59,130,246,0.45)';
}

export function VirtualCardView({
  card,
  width = 320,
  height = 168,
  showActions,
  onToggleFreeze,
}: Props) {
  return (
    <View style={[styles.wrap, { width }]}>
      <View
        style={[
          styles.glow,
          {
            width: width * 0.92,
            height: height * 0.7,
            backgroundColor: glowColor(card.color),
          },
        ]}
      />
      <LinearGradient
        colors={[card.color, blend(card.color)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            width,
            height,
            opacity: card.frozen ? 0.72 : 1,
          },
        ]}
      >
        <View style={styles.row}>
          <Text style={[styles.label, { color: card.textColor }]}>{card.label}</Text>
          <Text style={[styles.last4, { color: card.textColor }]}>···· {card.last4}</Text>
        </View>
        <View style={styles.bottom}>
          {showActions && (
            <View style={styles.actions}>
              <Action icon="snow-outline" />
              <Action icon="card-outline" />
              <Action icon="settings-outline" />
            </View>
          )}
          {showActions && (
            <Switch
              value={!card.frozen}
              onValueChange={onToggleFreeze}
              trackColor={{ false: 'rgba(0,0,0,0.25)', true: 'rgba(255,255,255,0.55)' }}
              thumbColor="#fff"
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

function Action({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <PressableScale style={styles.actionBtn}>
      <Ionicons name={icon} size={14} color="#fff" />
    </PressableScale>
  );
}

function blend(hex: string) {
  // slightly darker end for gradient depth
  return hex;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  glow: {
    position: 'absolute',
    bottom: 4,
    borderRadius: 40,
    opacity: 0.85,
  },
  card: {
    borderRadius: radii.card,
    padding: spacing.lg,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...typography.section, fontWeight: '700' },
  last4: { ...typography.body, fontWeight: '600' },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
