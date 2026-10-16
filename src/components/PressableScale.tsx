import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { tapFeedback } from '../utils/feedback';

type Props = PressableProps & {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  haptic?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({ style, children, onPress, haptic = true, ...rest }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      style={[style, anim]}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 300 });
      }}
      onPress={(e) => {
        if (haptic) tapFeedback();
        onPress?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}
