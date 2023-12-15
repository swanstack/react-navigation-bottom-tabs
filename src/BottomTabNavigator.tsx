import React, { useCallback } from 'react';
import {
  TabRouter,
  createNavigatorFactory,
  useNavigationBuilder,
  type DefaultNavigatorOptions,
  type ParamListBase,
  type TabActionHelpers,
  type TabNavigationState,
  type TabRouterOptions,
} from '@react-navigation/native';
import {
  BottomTabView,
  type BottomTabNavigationEventMap,
} from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationConfig } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import BottomTabBar from './BottomTabBar';
import BottomTabPortalProvider from './BottomTabPortalProvider';
import BottomTabPortalHost from './BottomTabPortalHost';
import type { BottomTabBarProps, BottomTabNavigationOptions } from './types';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap
> &
  TabRouterOptions &
  Omit<BottomTabNavigationConfig, 'tabBar'> & {
    tabBar?: (props: BottomTabBarProps) => React.ReactNode;
  };

function BottomTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
  sceneContainerStyle,
  tabBar,
  ...rest
}: Props) {
  const defaultScreenOptions: BottomTabNavigationOptions = {};

  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      BottomTabNavigationOptions,
      BottomTabNavigationEventMap
    >(TabRouter, {
      id,
      initialRouteName,
      backBehavior,
      children,
      screenListeners,
      screenOptions,
      defaultScreenOptions,
    });

  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => {
      if (tabBar) {
        return tabBar(props);
      }
      return <BottomTabBar {...props} />;
    },
    [tabBar]
  );

  return (
    <NavigationContent>
      <BottomTabPortalProvider>
        <BottomTabPortalHost />
        <BottomTabView
          tabBar={renderTabBar as any}
          {...rest}
          state={state}
          navigation={navigation}
          descriptors={descriptors as any}
          sceneContainerStyle={sceneContainerStyle}
        />
      </BottomTabPortalProvider>
    </NavigationContent>
  );
}

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap,
  typeof BottomTabNavigator
>(BottomTabNavigator);
