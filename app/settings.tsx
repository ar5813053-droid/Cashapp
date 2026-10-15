import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { PressableScale } from '../../src/components/PressableScale';

function Row({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#333', true: colors.accentGreen }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [motion, setMotion] = useState(true);
  const [haptics, setHaptics] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </PressableScale>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Appearance</Text>
        <View style={styles.group}>
          <Row label="Dark theme" value={dark} onValueChange={setDark} />
        </View>
        <Text style={styles.section}>Motion</Text>
        <View style={styles.group}>
          <Row label="Animations" value={motion} onValueChange={setMotion} />
          <Row label="Haptics (UI only)" value={haptics} onValueChange={setHaptics} />
        </View>
        <Text style={styles.section}>About this app</Text>
        <View style={styles.group}>
          <Text style={styles.about}>
            Pulse Pay is a simulation for design and interaction demos. Balances,
            cards, recipients, and transfers are sample data. No real money moves
            and no bank accounts are connected.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing.md,
  },
  title: { ...typography.title, color: colors.textPrimary, fontSize: 22 },
  content: {
    padding: layout.screenPadding,
    paddingBottom: layout.bottomNavHeight + 24,
  },
  section: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  group: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: { ...typography.body, color: colors.textPrimary },
  about: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
