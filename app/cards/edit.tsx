import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { PressableScale } from '../../src/components/PressableScale';
import { useAppStore } from '../../src/store/AppStore';
import { VirtualCardView } from '../../src/components/VirtualCard';

const THEMES = [
  { color: '#F5E74A', textColor: '#111' },
  { color: '#3DDFB0', textColor: '#111' },
  { color: '#3B82F6', textColor: '#fff' },
  { color: '#8B5CF6', textColor: '#fff' },
  { color: '#10B981', textColor: '#fff' },
];
const CARD_W = Dimensions.get('window').width - 40;

export default function CardEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, setCards } = useAppStore();
  const card = state.cards.find((c) => c.id === id) || state.cards[0];
  const [label, setLabel] = useState(card.label);
  const [holder, setHolder] = useState(card.holderName || state.profile.displayName);
  const [last4, setLast4] = useState(card.last4);
  const [expiry, setExpiry] = useState(card.expiry || '12/28');
  const [cvv, setCvv] = useState(card.cvv || '123');
  const [showCvv, setShowCvv] = useState(false);
  const [balance, setBalance] = useState(String(card.displayBalance ?? 0));
  const [color, setColor] = useState(card.color);
  const [textColor, setTextColor] = useState(card.textColor);
  const [bgUri, setBgUri] = useState<string | null>(card.backgroundUri || null);

  const preview = {
    ...card,
    label,
    last4,
    holderName: holder,
    expiry,
    cvv: showCvv ? cvv : '•••',
    displayBalance: parseFloat(balance) || 0,
    color,
    textColor,
    backgroundUri: bgUri,
  };

  const save = () => {
    setCards(
      state.cards.map((c) =>
        c.id === card.id
          ? {
              ...c,
              label: label.trim() || c.label,
              last4: last4.slice(-4) || c.last4,
              holderName: holder,
              expiry,
              cvv,
              displayBalance: parseFloat(balance) || 0,
              color,
              textColor,
              backgroundUri: bgUri,
            }
          : c
      )
    );
    router.back();
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets[0]?.uri) setBgUri(res.assets[0].uri);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </PressableScale>
        <Text style={styles.title}>Edit card</Text>
        <PressableScale onPress={save}>
          <Text style={styles.save}>Save</Text>
        </PressableScale>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.demo}>Virtual / demo card — not a real payment instrument</Text>
        <VirtualCardView card={preview} width={CARD_W} height={170} />
        <Text style={styles.label}>Card name</Text>
        <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholderTextColor="#666" />
        <Text style={styles.label}>Cardholder</Text>
        <TextInput style={styles.input} value={holder} onChangeText={setHolder} placeholderTextColor="#666" />
        <Text style={styles.label}>Last 4 (fictional)</Text>
        <TextInput style={styles.input} value={last4} onChangeText={setLast4} keyboardType="number-pad" placeholderTextColor="#666" />
        <Text style={styles.label}>Expiry (fictional)</Text>
        <TextInput style={styles.input} value={expiry} onChangeText={setExpiry} placeholderTextColor="#666" />
        <Text style={styles.label}>{showCvv ? 'CVV (fictional)' : 'CVV hidden'}</Text>
        <TextInput style={styles.input} value={showCvv ? cvv : '•••'} onChangeText={setCvv} editable={showCvv} placeholderTextColor="#666" />
        <PressableScale onPress={() => setShowCvv((v) => !v)}>
          <Text style={styles.link}>{showCvv ? 'Hide CVV' : 'Reveal fictional CVV'}</Text>
        </PressableScale>
        <Text style={styles.label}>Display balance</Text>
        <TextInput style={styles.input} value={balance} onChangeText={setBalance} keyboardType="decimal-pad" placeholderTextColor="#666" />
        <Text style={styles.label}>Theme</Text>
        <View style={styles.row}>
          {THEMES.map((t) => (
            <PressableScale
              key={t.color}
              onPress={() => {
                setColor(t.color);
                setTextColor(t.textColor);
              }}
              style={[styles.swatch, { backgroundColor: t.color }, color === t.color && styles.swatchOn]}
            />
          ))}
        </View>
        <PressableScale style={styles.btn} onPress={pickImage}>
          <Text style={styles.btnText}>Upload background image</Text>
        </PressableScale>
        {bgUri ? (
          <PressableScale style={styles.btnGhost} onPress={() => setBgUri(null)}>
            <Text style={styles.btnGhostText}>Remove image</Text>
          </PressableScale>
        ) : null}
      </ScrollView>
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
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  save: { color: '#60A5FA', fontWeight: '600' },
  body: { padding: layout.screenPadding, paddingBottom: 40 },
  demo: { color: '#FBBF24', fontSize: 11, marginBottom: 12, textAlign: 'center' },
  label: { color: colors.textMuted, marginTop: 14, marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.md,
    padding: 12,
    color: '#fff',
  },
  row: { flexDirection: 'row', gap: 10 },
  swatch: { width: 36, height: 36, borderRadius: 18 },
  swatchOn: { borderWidth: 2, borderColor: '#fff' },
  link: { color: '#60A5FA', marginTop: 8 },
  btn: {
    marginTop: 20,
    backgroundColor: 'rgba(59,130,246,0.4)',
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
  btnGhost: { marginTop: 10, alignItems: 'center' },
  btnGhostText: { color: colors.textSecondary },
});
