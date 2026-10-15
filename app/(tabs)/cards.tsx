import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { CARDS } from '../../src/mock-data';
import { CardCarousel } from '../../src/components/CardCarousel';
import type { VirtualCard } from '../../src/types';

export default function CardsScreen() {
  const [cards, setCards] = useState<VirtualCard[]>(CARDS);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFreeze = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, frozen: !c.frozen } : c))
    );
  };

  const active = cards[activeIndex] ?? cards[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cards</Text>
        <Pressable style={styles.orderBtn} accessibilityLabel="Order a card">
          <Text style={styles.orderText}>Order a card</Text>
        </Pressable>
      </View>
      <View style={styles.demo}>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
        <CardCarousel
          cards={cards}
          onIndexChange={setActiveIndex}
          onToggleFreeze={toggleFreeze}
        />

        {active && (
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Selected card</Text>
            <Text style={styles.detailValue}>
              {active.label} ··· {active.last4}
            </Text>
            <Text style={styles.detailStatus}>
              {active.frozen ? 'Frozen (demo)' : 'Active (demo)'}
            </Text>
          </View>
        )}

        <Pressable style={styles.addCard} accessibilityLabel="Add digital card">
          <Ionicons name="add" size={28} color={colors.textSecondary} />
          <Text style={styles.addText}>Add digital card</Text>
        </Pressable>
      </ScrollView>
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
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  orderBtn: {
    backgroundColor: colors.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
  },
  orderText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  demo: { marginTop: spacing.md, alignItems: 'center' },
  content: {
    paddingBottom: layout.bottomNavHeight + 36,
  },
  detail: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  detailValue: {
    ...typography.section,
    color: colors.textPrimary,
    marginTop: 4,
  },
  detailStatus: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 6,
  },
  addCard: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.lg,
    height: 88,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
