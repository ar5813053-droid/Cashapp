import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
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

function borderGlow(c: string) {
  if (c === colors.cardYellow) return { border: '#FFF6A0', glow: 'rgba(245,231,74,0.55)' };
  if (c === colors.cardMint) return { border: '#A8FFE0', glow: 'rgba(61,223,176,0.5)' };
  return { border: '#93C5FD', glow: 'rgba(59,130,246,0.55)' };
}

export function VirtualCardView({
  card,
  width = 320,
  height = 168,
  showActions,
  onToggleFreeze,
}: Props) {
  const g = borderGlow(card.color);
  return (
    <View style={[styles.wrap, { width }]}>
      <View
        style={[
          styles.glow,
          {
            width: width * 0.94,
            height: height * 0.55,
            backgroundColor: g.glow,
          },
        ]}
      />
      <View
        style={[
          styles.borderShell,
          {
            width,
            borderColor: g.border,
            opacity: card.frozen ? 0.75 : 1,
            ...Platform.select({
              ios: {
                shadowColor: g.border,
                shadowOpacity: 0.55,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 4 },
              },
              android: { elevation: 8 },
            }),
          },
        ]}
      >
        <LinearGradient
          colors={[card.color, card.color]}
          style={[styles.card, { height: height - 4 }]}
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

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: spacing.xl },
  glow: {
    position: 'absolute',
    bottom: 2,
    borderRadius: 40,
  },
  borderShell: {
    borderRadius: radii.card,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: radii.card - 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
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
