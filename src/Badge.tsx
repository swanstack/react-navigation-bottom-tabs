import { useTheme } from '@react-navigation/native';
import color from 'color';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  visible: boolean;
  children?: string | number;
  size?: number;
  style?: StyleProp<TextStyle>;
};

function Badge({ children, style, visible = true, size = 18, ...rest }: Props) {
  const opacity = useSharedValue(visible ? 1 : 0);
  const [rendered, setRendered] = useState(visible);
  const theme = useTheme();

  const postAnimation = useCallback(() => {
    if (!visible) {
      setRendered(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    opacity.value = withTiming(
      visible ? 1 : 0,
      { duration: 150 },
      (finished) => {
        if (finished) {
          runOnJS(postAnimation)();
        }
      }
    );

    return () => {
      opacity.value = withTiming(0);
    };
  }, [opacity, rendered, visible, postAnimation]);

  useEffect(() => {
    if (!rendered && visible) {
      setRendered(true);
    }
  }, [rendered, visible]);

  const scale = interpolate(opacity.value, [0, 0.5], [1, 1]);

  const animationStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale }],
  }));

  if (!rendered && !visible) {
    return null;
  }

  const { backgroundColor = theme.colors.notification, ...restStyle } =
    StyleSheet.flatten(style) || {};
  const textColor = color(backgroundColor).isLight() ? 'black' : 'white';
  const borderRadius = size / 2;
  const fontSize = Math.floor((size * 3) / 4);

  return (
    <Animated.Text
      numberOfLines={1}
      style={[
        styles.container,
        {
          color: textColor,
          lineHeight: size - 1,
          height: size,
          minWidth: size,
          backgroundColor,
          fontSize,
          borderRadius,
        },
        animationStyles,
        restStyle,
      ]}
      {...rest}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
});

export default Badge;
