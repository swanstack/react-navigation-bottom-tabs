import React, {
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { BottomTabBarHeightCallbackContext } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps, BottomTabRoute } from './types';
import BottomTabPortal from './BottomTabPortal';
import BottomTabBarMoreBottomSheet from './BottomTabBarMoreBottomSheet';
import MissingIcon from './MissingIcon';
import Badge from './Badge';
import PulsePressable from './PulsePressable';

const DEFAULT_MAX_VISIBLE_TABS = 4;
const DEFAULT_ICON_SIZE = 28;
const DEFAULT_BADGE_SIZE = (25 * 3) / 4;
const MIN_TAB_BAR_PADDING = 12;

function BottomTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const navTheme = useTheme();
  const dimensions = useWindowDimensions();
  const isLandscape = dimensions.width > dimensions.height;
  const handleHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const [tabBarHeight, setTabBarHeight] = useState<number>(0);
  const [showMore, setShowMore] = useState(false);

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute!.key];
  const focusedOptions = focusedDescriptor!.options;

  const {
    tabBarBackground = () => null,
    tabBarStyle,
    tabBarMaxVisibleTabs = DEFAULT_MAX_VISIBLE_TABS,
    tabBarPulseOnPress = true,
    tabBarMoreBottomSheetModalStyle,
    tabBarMoreBottomSheetBackdropStyle,
  } = focusedOptions;

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height;
      setTabBarHeight(height);
      handleHeightChange?.(height);
    },
    [handleHeightChange]
  );

  const handleToggleMore = useCallback(() => {
    setShowMore((prev) => !prev);
  }, []);

  const handleCloseMore = useCallback(() => {
    setShowMore(false);
  }, []);

  const maxRoutes = tabBarMaxVisibleTabs < 1 ? 1 : tabBarMaxVisibleTabs;
  const allRoutesSize = state.routes.length;
  const visibleRoutes =
    allRoutesSize > maxRoutes
      ? state.routes.slice(0, maxRoutes - 1)
      : state.routes;
  const notVisibleRoutes =
    allRoutesSize > maxRoutes ? state.routes.slice(maxRoutes - 1) : [];
  const showMoreButton = notVisibleRoutes.length > 0;

  const renderVisibleTab = (route: BottomTabRoute, index: number) => {
    const { options } = descriptors[route.key]!;
    const {
      title,
      tabBarAccessibilityLabel,
      tabBarTestID,
      tabBarShowLabel = true,
      tabBarAllowFontScaling,
      tabBarActiveTintColor = navTheme.colors.primary,
      tabBarInactiveTintColor = navTheme.colors.text,
      tabBarActiveBackgroundColor = 'transparent',
      tabBarInactiveBackgroundColor = 'transparent',
      tabBarButton,
      tabBarItemStyle,
      tabBarIcon,
      tabBarIconStyle,
      tabBarIconSize = DEFAULT_ICON_SIZE,
      tabBarLabel,
      tabBarLabelPosition = isLandscape ? 'beside-icon' : 'below-icon',
      tabBarLabelStyle,
      tabBarBadge,
      tabBarBadgeStyle,
    } = options;
    const isFocused = state.index === index && !showMore;
    const color = isFocused ? tabBarActiveTintColor : tabBarInactiveTintColor;
    const backgroundColor = isFocused
      ? tabBarActiveBackgroundColor
      : tabBarInactiveBackgroundColor;

    const iconElement = tabBarIcon ? (
      tabBarIcon({
        focused: isFocused,
        color,
        size: tabBarIconSize,
      })
    ) : (
      <MissingIcon
        size={tabBarIconSize}
        color={navTheme.colors.card}
        backgroundColor={color}
      >
        ▼
      </MissingIcon>
    );

    const badgeElement = (
      <Badge
        visible={tabBarBadge != null}
        style={[styles.badge, tabBarBadgeStyle]}
        size={DEFAULT_BADGE_SIZE}
      >
        {tabBarBadge}
      </Badge>
    );

    let label: string | ReactNode = title ?? route.name;
    if (tabBarLabel !== undefined) {
      if (typeof tabBarLabel === 'string') {
        label = tabBarLabel;
      } else {
        label = tabBarLabel({
          focused: isFocused,
          color,
          children: title ?? route.name,
          position: tabBarLabelPosition,
        });
      }
    }

    const labelElement =
      typeof label === 'string' ? (
        <Text
          numberOfLines={1}
          allowFontScaling={tabBarAllowFontScaling}
          style={[
            styles.buttonLabel,
            tabBarLabelPosition === 'beside-icon' && styles.buttonLabelBeside,
            { color },
            tabBarLabelStyle,
          ]}
        >
          {label}
        </Text>
      ) : (
        label
      );

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }

      handleCloseMore();
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    const accessibilityLabel =
      tabBarAccessibilityLabel !== undefined
        ? tabBarAccessibilityLabel
        : typeof label === 'string' && Platform.OS === 'ios'
        ? `${label}, tab, ${index + 1} of ${allRoutesSize}`
        : undefined;

    const style = [
      styles.button,
      tabBarLabelPosition === 'below-icon'
        ? styles.buttonPortrait
        : styles.buttonLandscape,
      { backgroundColor },
      tabBarItemStyle,
    ];

    if (tabBarButton) {
      return tabBarButton({
        accessibilityRole: 'button',
        accessibilityState: { selected: isFocused },
        accessibilityLabel,
        testID: tabBarTestID,
        onPress,
        onLongPress,
        style,
        isFocused,
        children: (
          <>
            <View style={[styles.buttonIcon, tabBarIconStyle]}>
              {iconElement}
              {badgeElement}
            </View>
            {tabBarShowLabel && labelElement}
          </>
        ),
      });
    }

    return (
      <PulsePressable
        accessibilityRole="button"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={accessibilityLabel}
        testID={tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={style}
      >
        {(_, animationStyle) => (
          <>
            <Animated.View
              style={[
                styles.buttonIcon,
                tabBarPulseOnPress && animationStyle,
                tabBarIconStyle,
              ]}
            >
              {iconElement}
              {badgeElement}
            </Animated.View>
            {tabBarShowLabel && labelElement}
          </>
        )}
      </PulsePressable>
    );
  };

  const renderTabMore = () => {
    const notVisibleRouteIsFocused = notVisibleRoutes.some(
      (route) => route.key === state.routes[state.index]!.key
    );
    const isFocused = showMore || notVisibleRouteIsFocused;

    const {
      tabBarMoreAccessibilityLabel,
      tabBarMoreTestID,
      tabBarMoreShowLabel = focusedOptions.tabBarShowLabel ?? true,
      tabBarMoreAllowFontScaling = focusedOptions.tabBarAllowFontScaling,
      tabBarMoreActiveTintColor = focusedOptions.tabBarActiveTintColor ??
        navTheme.colors.primary,
      tabBarMoreInactiveTintColor = focusedOptions.tabBarInactiveTintColor ??
        navTheme.colors.text,
      tabBarMoreActiveBackgroundColor = focusedOptions.tabBarActiveBackgroundColor ??
        'transparent',
      tabBarMoreInactiveBackgroundColor = focusedOptions.tabBarInactiveBackgroundColor ??
        'transparent',
      tabBarMoreButton,
      tabBarMoreItemStyle = focusedOptions.tabBarItemStyle,
      tabBarMoreIcon,
      tabBarMoreIconStyle = focusedOptions.tabBarIconStyle,
      tabBarMoreIconSize = focusedOptions.tabBarIconSize ?? DEFAULT_ICON_SIZE,
      tabBarMoreLabel = 'More',
      tabBarMoreLabelPosition = focusedOptions.tabBarLabelPosition ??
      isLandscape
        ? 'beside-icon'
        : 'below-icon',
      tabBarMoreLabelStyle = focusedOptions.tabBarLabelStyle,
      tabBarMoreBadge,
      tabBarMoreBadgeStyle = focusedOptions.tabBarBadgeStyle,
    } = focusedOptions;

    const color = isFocused
      ? tabBarMoreActiveTintColor
      : tabBarMoreInactiveTintColor;
    const backgroundColor = isFocused
      ? tabBarMoreActiveBackgroundColor
      : tabBarMoreInactiveBackgroundColor;

    const iconElement = tabBarMoreIcon ? (
      tabBarMoreIcon({
        focused: isFocused,
        color,
        size: tabBarMoreIconSize,
      })
    ) : (
      <MissingIcon
        size={tabBarMoreIconSize}
        color={navTheme.colors.card}
        backgroundColor={color}
      >
        ⋯
      </MissingIcon>
    );

    const badgeElement = (
      <Badge
        visible={tabBarMoreBadge != null}
        style={[styles.badge, tabBarMoreBadgeStyle]}
        size={DEFAULT_BADGE_SIZE}
      >
        {tabBarMoreBadge}
      </Badge>
    );

    let label: string | ReactNode = 'More';
    if (tabBarMoreLabel !== undefined) {
      if (typeof tabBarMoreLabel === 'string') {
        label = tabBarMoreLabel;
      } else {
        label = tabBarMoreLabel({
          focused: isFocused,
          color,
          children: 'More',
          position: tabBarMoreLabelPosition,
        });
      }
    }

    const labelElement =
      typeof label === 'string' ? (
        <Text
          numberOfLines={1}
          allowFontScaling={tabBarMoreAllowFontScaling}
          style={[
            styles.buttonLabel,
            tabBarMoreLabelPosition === 'beside-icon' &&
              styles.buttonLabelBeside,
            { color },
            tabBarMoreLabelStyle,
          ]}
        >
          {label}
        </Text>
      ) : (
        label
      );

    const accessibilityLabel =
      tabBarMoreAccessibilityLabel !== undefined
        ? tabBarMoreAccessibilityLabel
        : typeof label === 'string' && Platform.OS === 'ios'
        ? `${label}, button`
        : undefined;

    const style = [
      styles.button,
      tabBarMoreLabelPosition === 'below-icon'
        ? styles.buttonPortrait
        : styles.buttonLandscape,
      { backgroundColor },
      tabBarMoreItemStyle,
    ];

    if (tabBarMoreButton) {
      return tabBarMoreButton({
        accessibilityRole: 'button',
        accessibilityState: { selected: false },
        accessibilityLabel,
        testID: tabBarMoreTestID,
        onPress: handleToggleMore,
        style,
        isFocused,
        children: (
          <>
            <View style={[styles.buttonIcon, tabBarMoreIconStyle]}>
              {iconElement}
              {badgeElement}
            </View>
            {tabBarMoreShowLabel && labelElement}
          </>
        ),
      });
    }

    return (
      <PulsePressable
        accessibilityRole="button"
        accessibilityState={{ selected: false }}
        accessibilityLabel={accessibilityLabel}
        testID={tabBarMoreTestID}
        onPress={handleToggleMore}
        style={style}
      >
        {(_, animationStyle) => (
          <>
            <Animated.View
              style={[
                styles.buttonIcon,
                tabBarPulseOnPress && animationStyle,
                tabBarMoreIconStyle,
              ]}
            >
              {iconElement}
              {badgeElement}
            </Animated.View>
            {tabBarMoreShowLabel && labelElement}
          </>
        )}
      </PulsePressable>
    );
  };

  const renderNotVisibleTab = (route: BottomTabRoute, index: number) => {
    const realIndex = index + visibleRoutes.length;
    const { options } = descriptors[route.key]!;
    const {
      title,
      tabBarAccessibilityLabel,
      tabBarTestID,
      tabBarMoreBottomSheetActiveTintColor = options.tabBarActiveTintColor ??
        navTheme.colors.primary,
      tabBarMoreBottomSheetInactiveTintColor = options.tabBarInactiveTintColor ??
        navTheme.colors.text,
      tabBarMoreBottomSheetActiveBackgroundColor = options.tabBarActiveBackgroundColor ??
        'transparent',
      tabBarMoreBottomSheetInactiveBackgroundColor = options.tabBarInactiveBackgroundColor ??
        'transparent',
      tabBarMoreBottomSheetButton = options.tabBarButton,
      tabBarMoreBottomSheetItemStyle = options.tabBarItemStyle,
      tabBarMoreBottomSheetIcon = options.tabBarIcon,
      tabBarMoreBottomSheetIconStyle = options.tabBarIconStyle,
      tabBarMoreBottomSheetIconSize = options.tabBarIconSize ?? 28,
      tabBarMoreBottomSheetLabel = options.tabBarLabel,
      tabBarMoreBottomSheetLabelStyle = options.tabBarLabelStyle,
      tabBarBadge,
      tabBarMoreBottomSheetBadgeStyle = options.tabBarBadgeStyle,
    } = options;
    const isFocused = state.index === realIndex;
    const color = isFocused
      ? tabBarMoreBottomSheetActiveTintColor
      : tabBarMoreBottomSheetInactiveTintColor;
    const backgroundColor = isFocused
      ? tabBarMoreBottomSheetActiveBackgroundColor
      : tabBarMoreBottomSheetInactiveBackgroundColor;

    const iconElement = tabBarMoreBottomSheetIcon ? (
      tabBarMoreBottomSheetIcon({
        focused: isFocused,
        color,
        size: tabBarMoreBottomSheetIconSize,
      })
    ) : (
      <MissingIcon
        size={tabBarMoreBottomSheetIconSize}
        color={navTheme.colors.card}
        backgroundColor={color}
      >
        ▼
      </MissingIcon>
    );

    const badgeElement = (
      <Badge
        visible={tabBarBadge != null}
        style={[styles.badge, tabBarMoreBottomSheetBadgeStyle]}
        size={DEFAULT_BADGE_SIZE}
      >
        {tabBarBadge}
      </Badge>
    );

    let label: string | ReactNode = title ?? route.name;
    if (tabBarMoreBottomSheetLabel !== undefined) {
      if (typeof tabBarMoreBottomSheetLabel === 'string') {
        label = tabBarMoreBottomSheetLabel;
      } else {
        label = tabBarMoreBottomSheetLabel({
          focused: isFocused,
          color,
          children: title ?? route.name,
          position: 'beside-icon',
        });
      }
    }

    const labelElement =
      typeof label === 'string' ? (
        <Text
          numberOfLines={1}
          style={[
            styles.bottomSheetButtonLabel,
            { color },
            tabBarMoreBottomSheetLabelStyle,
          ]}
        >
          {label}
        </Text>
      ) : (
        label
      );

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }

      handleCloseMore();
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    const accessibilityLabel =
      tabBarAccessibilityLabel !== undefined
        ? tabBarAccessibilityLabel
        : typeof label === 'string' && Platform.OS === 'ios'
        ? `${label}, tab, ${index + 1} of ${allRoutesSize}`
        : undefined;

    const style = [
      styles.bottomSheetButton,
      {
        backgroundColor,
        borderBottomColor: navTheme.colors.border,
      },
      tabBarMoreBottomSheetItemStyle,
    ];

    if (tabBarMoreBottomSheetButton) {
      return tabBarMoreBottomSheetButton({
        accessibilityRole: 'button',
        accessibilityState: { selected: isFocused },
        accessibilityLabel,
        testID: tabBarTestID,
        onPress,
        onLongPress,
        style,
        isFocused,
        children: (
          <>
            <View style={[styles.buttonIcon, tabBarMoreBottomSheetIconStyle]}>
              {iconElement}
              {badgeElement}
            </View>
            {labelElement}
          </>
        ),
      });
    }

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={accessibilityLabel}
        testID={tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={style}
      >
        <View style={[styles.buttonIcon, tabBarMoreBottomSheetIconStyle]}>
          {iconElement}
          {badgeElement}
        </View>
        {labelElement}
      </Pressable>
    );
  };

  const tabBarBackgroundElement = tabBarBackground();
  const tabBarBackgroundColor =
    tabBarBackgroundElement != null ? 'transparent' : navTheme.colors.card;

  const tabBarPaddingBottom =
    insets.bottom < MIN_TAB_BAR_PADDING ? MIN_TAB_BAR_PADDING : insets.bottom;

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: tabBarBackgroundColor,
            borderTopColor: navTheme.colors.border,
            paddingBottom: tabBarPaddingBottom,
          },
          tabBarStyle,
        ]}
        onLayout={handleLayout}
        accessibilityRole="tablist"
      >
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {tabBarBackgroundElement}
        </View>
        {visibleRoutes.map((route, index) => (
          <React.Fragment key={route.key}>
            {renderVisibleTab(route, index)}
          </React.Fragment>
        ))}
        {showMoreButton && renderTabMore()}
      </Animated.View>
      {showMoreButton && (
        <BottomTabPortal>
          <BottomTabBarMoreBottomSheet
            isVisible={showMore}
            tabBarHeight={tabBarHeight}
            onClose={handleCloseMore}
            backdropStyle={tabBarMoreBottomSheetBackdropStyle}
            modalStyle={[
              styles.bottomSheetModal,
              tabBarMoreBottomSheetModalStyle,
            ]}
          >
            {notVisibleRoutes.map((route, index) => (
              <React.Fragment key={route.key}>
                {renderNotVisibleTab(route, index)}
              </React.Fragment>
            ))}
          </BottomTabBarMoreBottomSheet>
        </BottomTabPortal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: MIN_TAB_BAR_PADDING,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  buttonPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
    gap: 6,
  },
  buttonLandscape: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  buttonIcon: {
    // flex: 1, // FIXME: text ellipsis with centered text not working
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonLabelBeside: {
    textAlign: 'left',
    // flex: 1, // FIXME: text ellipsis with centered text not working
  },
  bottomSheetModal: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bottomSheetButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bottomSheetButtonLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
  },
});

export default BottomTabBar;
