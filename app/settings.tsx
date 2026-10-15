import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radii, typography, layout } from '../src/design/tokens';
import { PressableScale } from '../src/components/PressableScale';
import { useAppStore } from '../src/store/AppStore';

const ACCENTS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4'];

export default function SettingsScreen() {
  const router = useRouter();
  const { state, setProfile, setStartingCash, resetPortfolio } = useAppStore();
  const [name, setName] = useState(state.profile.displayName);
  const [user, setUser] = useState(state.profile.username);
  const [start, setStart] = useState(String(state.startingCash));

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets[0]?.uri) {
      setProfile({ avatarUri: res.assets[0].uri });
    }
  };

  const save = () => {
    setProfile({
      displayName: name.trim() || 'Alex',
      username: user.trim().startsWith('@') ? user.trim() : `@${user.trim() || 'user'}`,
    });
    const n = parseFloat(start);
    if (Number.isFinite(n) && n >= 0) setStartingCash(n);
    Alert.alert('Saved', 'Local demo profile updated.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </PressableScale>
        <Text style={styles.title}>Profile</Text>
        <PressableScale onPress={save}>
          <Text style={styles.save}>Save</Text>
        </PressableScale>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <PressableScale style={styles.avatarWrap} onPress={pickPhoto}>
          {state.profile.avatarUri ? (
            <Image source={{ uri: state.profile.avatarUri }} style={styles.avatarImg} />
          ) : (
            <View style={[styles.avatarImg, { backgroundColor: state.profile.accent }]}>
              <Text style={styles.avatarLetter}>
                {(name || 'A').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.changePhoto}>Change photo</Text>
        </PressableScale>

        <Text style={styles.label}>Display name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#666" />

        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={user} onChangeText={setUser} placeholderTextColor="#666" />

        <Text style={styles.label}>Accent</Text>
        <View style={styles.row}>
          {ACCENTS.map((c) => (
            <PressableScale
              key={c}
              onPress={() => setProfile({ accent: c })}
              style={[
                styles.swatch,
                { backgroundColor: c },
                state.profile.accent === c && styles.swatchOn,
              ]}
            />
          ))}
        </View>

        <Text style={styles.label}>Starting virtual cash (USD)</Text>
        <TextInput
          style={styles.input}
          value={start}
          onChangeText={setStart}
          keyboardType="decimal-pad"
          placeholderTextColor="#666"
        />
        <Text style={styles.hint}>
          Virtual Cash: ${state.cash.toFixed(2)} · Starting: ${state.startingCash.toFixed(2)}
        </Text>

        <PressableScale
          style={styles.danger}
          onPress={() =>
            Alert.alert('Reset demo portfolio?', 'Clears positions and restores starting cash.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: resetPortfolio },
            ])
          }
        >
          <Text style={styles.dangerText}>Reset demo portfolio</Text>
        </PressableScale>

        <Text style={styles.about}>
          JustPay is a simulation. Balances, cards, and trades are virtual. Market prices may come
          from public APIs and can be delayed or cached. No real money moves.
        </Text>
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
  save: { ...typography.label, color: '#60A5FA' },
  content: { padding: layout.screenPadding, paddingBottom: 40 },
  avatarWrap: { alignItems: 'center', marginVertical: spacing.xl },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: 36, fontWeight: '700', color: '#fff' },
  changePhoto: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  label: { ...typography.caption, color: colors.textMuted, marginTop: spacing.lg, marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    ...typography.body,
  },
  row: { flexDirection: 'row', gap: 10, marginTop: 4 },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  swatchOn: { borderWidth: 2, borderColor: '#fff' },
  hint: { ...typography.micro, color: colors.textMuted, marginTop: spacing.sm },
  danger: {
    marginTop: spacing.xxl,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  dangerText: { ...typography.label, color: '#F87171' },
  about: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xxl,
    lineHeight: 20,
  },
});
