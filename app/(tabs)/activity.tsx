import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { TRANSACTIONS } from '../../src/mock-data';
import { TransactionRow } from '../../src/components/TransactionRow';
import { DemoBanner } from '../../src/components/DemoBanner';

export default function ActivityScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const data = TRANSACTIONS.filter((t) =>
    t.merchant.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Activity</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.demo}>
        <DemoBanner compact />
      </View>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.search}
          placeholder="Search transactions"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.rowWrap}>
            <TransactionRow item={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No demo transactions match.</Text>
        }
      />
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
  demo: { marginTop: spacing.sm, alignItems: 'center' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    margin: layout.screenPadding,
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  search: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.bottomNavHeight + 24,
  },
  rowWrap: {
    backgroundColor: colors.bgSheet,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});
