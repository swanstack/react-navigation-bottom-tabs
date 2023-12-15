import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import type {
  GestureResponderEvent,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props extends Omit<PressableProps, 'children'> {
  children: (
    pressed: PressableStateCallbackType,
    animationStyle: StyleProp<ViewStyle>
  ) => React.ReactNode;
  duration?: number;
}

const PulsePressable = ({
  children,
  onPress,
  duration = 400,
  ...props
}: Props) => {
  const scale = useSharedValue(1);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      onPress?.(e);
      scale.value = withSequence(
        withTiming(1.1, {
          duration: duration / 2,
          easing: Easing.ease,
        }),
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.ease,
        })
      );
    },
    [duration, scale, onPress]
  );

  const animationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress} {...props}>
      {(pressed) => children(pressed, animationStyle)}
    </Pressable>
  );
};

export default PulsePressable;
