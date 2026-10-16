import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { PressableScale } from '../../src/components/PressableScale';
import { useAppStore } from '../../src/store/AppStore';

export default function RequestScreen() {
  const router = useRouter();
  const { state } = useAppStore();
  const handle = `${state.profile.username.replace(/^@/, '')}.justpay.demo`;
  const payload = useMemo(
    () =>
      JSON.stringify({
        type: 'justpay-demo-request',
        handle: `@${handle}`,
        name: state.profile.displayName,
        note: 'DEMO — no real money',
      }),
    [handle, state.profile.displayName]
  );

  const copy = async () => {
    Alert.alert('Demo handle', `@${handle}`);
  };

  const share = async () => {
    await Share.share({
      message: `JustPay demo request @${handle}\n${payload}`,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color="#fff" />
        </PressableScale>
        <Text style={styles.title}>Request</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.brand}>JustPay</Text>
        <Text style={styles.name}>{state.profile.displayName}</Text>
        <Text style={styles.handle}>@{handle}</Text>
        <Text style={styles.badge}>JustPay Demo Request — No Real Money</Text>

        <View style={styles.qrWrap}>
          <QRCode value={payload} size={180} backgroundColor="#fff" color="#0A0A12" />
        </View>

        <View style={styles.actions}>
          <PressableScale style={styles.btn} onPress={copy}>
            <Ionicons name="copy-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Copy handle</Text>
          </PressableScale>
          <PressableScale style={styles.btn} onPress={share}>
            <Ionicons name="share-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Share</Text>
          </PressableScale>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#05050A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing.md,
  },
  title: { ...typography.title, color: '#fff', fontSize: 22 },
  card: {
    margin: layout.screenPadding,
    marginTop: spacing.xxl,
    padding: spacing.xxl,
    borderRadius: radii.sheet,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.35)',
    alignItems: 'center',
  },
  brand: { fontSize: 20, fontWeight: '800', color: '#60A5FA' },
  name: { ...typography.section, color: '#fff', marginTop: spacing.md },
  handle: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  badge: {
    ...typography.micro,
    color: '#FBBF24',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  qrWrap: {
    marginTop: spacing.xxl,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: spacing.xxl },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59,130,246,0.35)',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 21,
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
