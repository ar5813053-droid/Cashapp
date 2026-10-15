import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../design/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  onDigit: (d: string) => void;
  onOperator: (op: '+' | '-' | '×' | '÷') => void;
  onBackspace: () => void;
  onDecimal: () => void;
};

function Key({
  label,
  onPress,
  flex = 1,
  icon,
}: {
  label?: string;
  onPress: () => void;
  flex?: number;
  icon?: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 18 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12 });
      }}
      style={[styles.key, { flex }, style]}
    >
      {icon ?? <Text style={styles.keyText}>{label}</Text>}
    </AnimatedPressable>
  );
}

export function Keypad({ onDigit, onOperator, onBackspace, onDecimal }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.ops}>
        {(['+', '-', '×', '÷'] as const).map((op) => (
          <Key key={op} label={op} onPress={() => onOperator(op)} />
        ))}
      </View>
      {[
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['.', '0', 'back'],
      ].map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((k) =>
            k === 'back' ? (
              <Key
                key={k}
                onPress={onBackspace}
                icon={<Ionicons name="backspace-outline" size={24} color={colors.textDarkSecondary} />}
              />
            ) : k === '.' ? (
              <Key key={k} label="." onPress={onDecimal} />
            ) : (
              <Key key={k} label={k} onPress={() => onDigit(k)} />
            )
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  ops: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: spacing.sm,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  key: {
    height: 56,
    borderRadius: radii.key,
    backgroundColor: colors.bgSheetMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '500',
    color: colors.textDark,
  },
});
