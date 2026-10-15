import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { CARDS } from '../../src/mock-data';
import { VirtualCardView } from '../../src/components/VirtualCard';
import { DemoBanner } from '../../src/components/DemoBanner';
import type { VirtualCard } from '../../src/types';

const CARD_W = Dimensions.get('window').width - layout.screenPadding * 2;

export default function CardsScreen() {
  const [cards, setCards] = useState<VirtualCard[]>(CARDS);

  const toggleFreeze = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, frozen: !c.frozen } : c))
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cards</Text>
        <Pressable style={styles.orderBtn} accessibilityLabel="Order a card">
          <Text style={styles.orderText}>Order a card</Text>
        </Pressable>
      </View>
      <View style={styles.demo}>
        <DemoBanner compact />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {cards.map((card) => (
          <View key={card.id} style={styles.cardWrap}>
            <VirtualCardView
              card={card}
              width={CARD_W}
              height={160}
              showActions
              onToggleFreeze={() => toggleFreeze(card.id)}
            />
            {card.frozen && (
              <View style={styles.frozenBadge}>
                <Ionicons name="snow" size={12} color="#fff" />
                <Text style={styles.frozenText}>Frozen</Text>
              </View>
            )}
          </View>
        ))}
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
  list: {
    padding: layout.screenPadding,
    paddingBottom: layout.bottomNavHeight + 40,
    gap: spacing.lg,
  },
  cardWrap: { position: 'relative' },
  frozenBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  frozenText: {
    ...typography.micro,
    color: '#fff',
    fontWeight: '700',
  },
  addCard: {
    height: 100,
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
