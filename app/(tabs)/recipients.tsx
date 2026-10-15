import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { RECIPIENTS, LINKED_ACCOUNTS } from '../../src/mock-data';
import { usePayment } from '../../src/context/PaymentContext';
import { PressableScale } from '../../src/components/PressableScale';

export default function RecipientsScreen() {
  const router = useRouter();
  const { setRecipient } = usePayment();
  const [tab, setTab] = useState<'all' | 'accounts'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      RECIPIENTS.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.handle.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const selectRecipient = (id: string) => {
    setRecipient(id);
    router.push('/payments/amount');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipients</Text>
        <PressableScale
          style={styles.addBtn}
          accessibilityLabel="Add recipient"
          onPress={() =>
            Alert.alert(
              'Add recipient',
              'Demo only — contact list is local sample data. Real contacts are not imported.'
            )
          }
        >
          <Text style={styles.addText}>Add</Text>
        </PressableScale>
      </View>

      <View style={styles.grid}>
        {RECIPIENTS.map((r) => (
          <PressableScale
            key={r.id}
            style={styles.contact}
            onPress={() => selectRecipient(r.id)}
            accessibilityLabel={`Send to ${r.name}`}
          >
            <View style={[styles.avatar, { backgroundColor: r.avatarColor }]}>
              <Text style={styles.initials}>{r.initials}</Text>
            </View>
            <Text style={styles.contactName} numberOfLines={1}>
              {r.name}
            </Text>
            <Text style={styles.contactHandle} numberOfLines={1}>
              {r.handle}
            </Text>
          </PressableScale>
        ))}
      </View>

      <View style={styles.sheet}>
        <View style={styles.tabs}>
          <PressableScale onPress={() => setTab('all')} style={styles.tab}>
            <Text style={[styles.tabText, tab === 'all' && styles.tabActive]}>All</Text>
          </PressableScale>
          <PressableScale onPress={() => setTab('accounts')} style={styles.tab}>
            <Text style={[styles.tabText, tab === 'accounts' && styles.tabActive]}>
              My accounts
            </Text>
          </PressableScale>
          <Ionicons
            name="search"
            size={16}
            color={colors.textDarkMuted}
            style={{ marginLeft: 'auto' }}
          />
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search"
          placeholderTextColor={colors.textDarkMuted}
          value={query}
          onChangeText={setQuery}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {tab === 'all'
            ? filtered.map((r) => (
                <PressableScale
                  key={r.id}
                  style={styles.row}
                  onPress={() => selectRecipient(r.id)}
                >
                  <View style={[styles.rowAvatar, { backgroundColor: r.avatarColor }]}>
                    <Text style={styles.rowInitials}>{r.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName}>{r.name}</Text>
                    <Text style={styles.rowSub}>{r.handle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textDarkMuted} />
                </PressableScale>
              ))
            : LINKED_ACCOUNTS.map((a) => (
                <PressableScale
                  key={a.id}
                  style={styles.row}
                  onPress={() => selectRecipient(a.id)}
                >
                  <View style={[styles.rowAvatar, { backgroundColor: a.avatarColor }]}>
                    <Text style={styles.rowInitials}>{a.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName}>{a.name}</Text>
                    <Text style={styles.rowSub}>
                      {a.bank} ··· {a.last4}
                    </Text>
                  </View>
                </PressableScale>
              ))}
          {tab === 'all' && filtered.length === 0 && (
            <Text style={styles.empty}>No recipients match your search.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing.md,
  },
  title: { ...typography.title, color: colors.textPrimary },
  addBtn: {
    backgroundColor: colors.pill,
    paddingHorizontal: spacing.lg,
    height: 36,
    borderRadius: radii.full,
    justifyContent: 'center',
  },
  addText: { ...typography.label, color: colors.textPrimary },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  contact: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: layout.avatarSize,
    height: layout.avatarSize,
    borderRadius: layout.avatarSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 18, fontWeight: '700', color: '#fff' },
  contactName: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  contactHandle: { ...typography.micro, color: colors.textMuted },
  sheet: {
    flex: 1,
    marginTop: spacing.lg,
    backgroundColor: colors.bgSheet,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: layout.bottomNavHeight + 20,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  tab: { paddingVertical: 4 },
  tabText: { ...typography.body, color: colors.textDarkMuted },
  tabActive: { color: colors.textDark, fontWeight: '700' },
  search: {
    backgroundColor: colors.bgSheetMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInitials: { fontWeight: '700', color: '#fff', fontSize: 13 },
  rowName: { ...typography.body, color: colors.textDark },
  rowSub: { ...typography.caption, color: colors.textDarkMuted },
  empty: {
    ...typography.caption,
    color: colors.textDarkMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
