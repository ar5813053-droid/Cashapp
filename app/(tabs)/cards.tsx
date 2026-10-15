import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { CARDS } from '../../src/mock-data';
import { VirtualCardView } from '../../src/components/VirtualCard';
import { PressableScale } from '../../src/components/PressableScale';
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
        <PressableScale style={styles.orderBtn}>
          <Text style={styles.orderText}>Order a card</Text>
        </PressableScale>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {cards.map((card, i) => (
          <Animated.View
            key={card.id}
            entering={FadeInDown.delay(i * 70).springify().damping(16)}
          >
            <VirtualCardView
              card={card}
              width={CARD_W}
              height={172}
              showActions
              onToggleFreeze={() => toggleFreeze(card.id)}
            />
          </Animated.View>
        ))}
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
    marginBottom: spacing.md,
  },
  title: { ...typography.title, color: colors.textPrimary },
  orderBtn: {
    backgroundColor: colors.pill,
    paddingHorizontal: spacing.lg,
    height: 36,
    borderRadius: radii.full,
    justifyContent: 'center',
  },
  orderText: { ...typography.label, color: colors.textPrimary },
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.bottomNavHeight + 40,
    paddingTop: spacing.sm,
  },
});
