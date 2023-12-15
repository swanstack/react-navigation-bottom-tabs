import { useTheme } from '@react-navigation/native';
import React, {
  useEffect,
  useCallback,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  isVisible: boolean;
  animationDuration?: number;
  tabBarHeight?: number;
  backdropStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  onClose?: () => void;
}>;

function BottomTabBarMoreBottomSheet({
  isVisible,
  animationDuration = 250,
  tabBarHeight = 0,
  backdropStyle,
  modalStyle,
  onClose,
  children,
}: Props) {
  const navTheme = useTheme();
  const [isCurrentVisible, setIsCurrentVisible] = useState(isVisible);
  const { height: windowHeight } = useWindowDimensions();
  const animationBackdropOpacity = useSharedValue(0);
  const animationModalY = useSharedValue(windowHeight);

  const animateOpening = useCallback(() => {
    setIsCurrentVisible(true);
    cancelAnimation(animationBackdropOpacity);
    cancelAnimation(animationModalY);
    animationBackdropOpacity.value = withTiming(1, {
      duration: animationDuration,
    });
    animationModalY.value = withTiming(0, {
      duration: animationDuration,
      easing: Easing.inOut(Easing.quad),
    });
  }, [animationBackdropOpacity, animationModalY, animationDuration]);

  const postAnimateClosing = useCallback(() => {
    setIsCurrentVisible(false);
    onClose?.();
  }, [onClose]);

  const animateClosing = useCallback(() => {
    cancelAnimation(animationBackdropOpacity);
    cancelAnimation(animationModalY);
    animationBackdropOpacity.value = withTiming(0, {
      duration: animationDuration,
    });
    animationModalY.value = withTiming(
      windowHeight,
      {
        duration: animationDuration,
        easing: Easing.inOut(Easing.quad),
      },
      (finished) => {
        if (finished) {
          runOnJS(postAnimateClosing)();
        }
      }
    );
  }, [
    windowHeight,
    postAnimateClosing,
    animationBackdropOpacity,
    animationModalY,
    animationDuration,
  ]);

  const handleBackdropPress = useCallback(() => {
    animateClosing();
  }, [animateClosing]);

  useEffect(() => {
    if (isVisible) {
      animateOpening();
    } else {
      animateClosing();
    }
  }, [isVisible, animateOpening, animateClosing]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animationBackdropOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animationModalY.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { bottom: tabBarHeight },
        !isCurrentVisible && styles.hidden,
      ]}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[styles.backdrop, backdropAnimatedStyle, backdropStyle]}
        />
      </TouchableWithoutFeedback>
      <View style={styles.area}>
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: navTheme.colors.card,
              borderTopColor: navTheme.colors.border,
            },
            modalAnimatedStyle,
            modalStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  hidden: {
    display: 'none',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  area: {
    overflow: 'hidden',
  },
  modal: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default BottomTabBarMoreBottomSheet;
