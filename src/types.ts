import type { ParamListBase } from '@react-navigation/native';
import type * as BottomTabs from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  TouchableWithoutFeedbackProps,
  ViewStyle,
} from 'react-native';

export type BottomTabHeaderProps = Omit<
  BottomTabs.BottomTabHeaderProps,
  'options' | 'navigation'
> & {
  options: BottomTabNavigationOptions;
  navigation: Omit<BottomTabNavigationProp<ParamListBase>, 'setOptions'> & {
    setOptions(options: Partial<BottomTabNavigationOptions>): void;
  };
};

export type BottomTabBarButtonProps = Omit<
  TouchableWithoutFeedbackProps,
  'onPress'
> & {
  isFocused: boolean;
  children: React.ReactNode;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
};

export type BottomTabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export type BottomTabBarButtonLabelProps = {
  focused: boolean;
  color: string;
  children: string;
  position: 'beside-icon' | 'below-icon';
};

interface AdditionalBottomTabNavigationOptions {
  /**
   * Max visible tabs including "More" tab.
   */
  tabBarMaxVisibleTabs?: number;

  tabBarIconSize?: number;
  tabBarPulseOnPress?: boolean;
  tabBarMoreAccessibilityLabel?: string;
  tabBarMoreTestID?: string;
  tabBarMoreShowLabel?: boolean;
  tabBarMoreAllowFontScaling?: boolean;
  tabBarMoreActiveTintColor?: string;
  tabBarMoreInactiveTintColor?: string;
  tabBarMoreActiveBackgroundColor?: string;
  tabBarMoreInactiveBackgroundColor?: string;
  tabBarMoreButton?: (props: BottomTabBarButtonProps) => React.ReactNode;
  tabBarMoreItemStyle?: StyleProp<ViewStyle>;
  tabBarMoreIcon?: (props: BottomTabBarIconProps) => React.ReactNode;
  tabBarMoreIconStyle?: StyleProp<ViewStyle>;
  tabBarMoreIconSize?: number;
  tabBarMoreLabel?:
    | string
    | ((props: BottomTabBarButtonLabelProps) => React.ReactNode);
  tabBarMoreLabelPosition?: 'beside-icon' | 'below-icon';
  tabBarMoreLabelStyle?: StyleProp<TextStyle>;
  tabBarMoreBadge?: string | number;
  tabBarMoreBadgeStyle?: StyleProp<ViewStyle>;
  tabBarMoreBottomSheetBackdropStyle?: StyleProp<ViewStyle>;
  tabBarMoreBottomSheetModalStyle?: StyleProp<ViewStyle>;
  tabBarMoreBottomSheetActiveTintColor?: string;
  tabBarMoreBottomSheetInactiveTintColor?: string;
  tabBarMoreBottomSheetActiveBackgroundColor?: string;
  tabBarMoreBottomSheetInactiveBackgroundColor?: string;
  tabBarMoreBottomSheetButton?: (
    props: BottomTabBarButtonProps
  ) => React.ReactNode;
  tabBarMoreBottomSheetItemStyle?: StyleProp<ViewStyle>;
  tabBarMoreBottomSheetIcon?: (props: BottomTabBarIconProps) => React.ReactNode;
  tabBarMoreBottomSheetIconStyle?: StyleProp<ViewStyle>;
  tabBarMoreBottomSheetIconSize?: number;
  tabBarMoreBottomSheetLabel?:
    | string
    | ((props: BottomTabBarButtonLabelProps) => React.ReactNode);
  tabBarMoreBottomSheetLabelStyle?: StyleProp<TextStyle>;
  tabBarMoreBottomSheetBadgeStyle?: StyleProp<ViewStyle>;
}

export type BottomTabNavigationOptions = Omit<
  BottomTabs.BottomTabNavigationOptions,
  | 'header'
  | 'tabBarStyle'
  | 'tabBarButton'
  | 'tabBarIcon'
  | 'tabBarLabel'
  | 'tabBarHideOnKeyboard'
  | 'tabBarVisibilityAnimationConfig'
> & {
  header?: (props: BottomTabHeaderProps) => React.ReactNode;
  tabBarStyle?: StyleProp<ViewStyle>;
  tabBarButton?: (props: BottomTabBarButtonProps) => React.ReactNode;
  tabBarIcon?: (props: BottomTabBarIconProps) => React.ReactNode;
  tabBarLabel?:
    | string
    | ((props: BottomTabBarButtonLabelProps) => React.ReactNode);
  /**
   * @deprecated No support for tabBarHideOnKeyboard
   */
  tabBarHideOnKeyboard?: BottomTabs.BottomTabNavigationOptions['tabBarHideOnKeyboard'];
  /**
   * @deprecated No support for tabBarVisibilityAnimationConfig
   */
  tabBarVisibilityAnimationConfig?: BottomTabs.BottomTabNavigationOptions['tabBarVisibilityAnimationConfig'];
} & AdditionalBottomTabNavigationOptions;

export type BottomTabDescriptorMap = Record<
  string,
  Omit<BottomTabs.BottomTabDescriptorMap[string], 'options' | 'navigation'> & {
    options: BottomTabNavigationOptions;
    navigation: Omit<
      BottomTabs.BottomTabDescriptorMap[string],
      'setOptions'
    > & {
      setOptions(options: Partial<BottomTabNavigationOptions>): void;
    };
  }
>;

export type BottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined
> = Omit<
  BottomTabs.BottomTabNavigationProp<ParamList, RouteName, NavigatorID>,
  'setOptions'
> & {
  setOptions(options: Partial<BottomTabNavigationOptions>): void;
};

export type BottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined
> = Omit<
  BottomTabs.BottomTabScreenProps<ParamList, RouteName, NavigatorID>,
  'navigation'
> & {
  navigation: BottomTabNavigationProp<ParamList, RouteName, NavigatorID>;
};

export type BottomTabBarProps = Omit<
  BottomTabs.BottomTabBarProps,
  'descriptors'
> & {
  descriptors: BottomTabDescriptorMap;
};

export type BottomTabRoute = BottomTabBarProps['state']['routes'][number];
