import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  NavigationContainer,
  type CompositeScreenProps,
  type NavigatorScreenParams,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  type BottomTabScreenProps,
} from '@swanstack/react-navigation-bottom-tabs';

/* Your Param List */

type MyTabsParamList = {
  List: undefined;
  Recipe: undefined;
  Pantry: undefined;
  MealPlan: undefined;
  Profile: undefined;
  Settings: undefined;
};

type RootStackParamList = {
  MyTabs: NavigatorScreenParams<MyTabsParamList>;
};

export type RootStackScreenProps<R extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, R>;

/* MyTabs is a nested navigator within the RootStack navigator */

export type MyTabsScreenProps<R extends keyof MyTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MyTabsParamList, R>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* Your Screens */

const ListScreen = (_props: MyTabsScreenProps<'List'>) => {
  return <View />;
};

const RecipeScreen = (_props: MyTabsScreenProps<'Recipe'>) => {
  return <View />;
};

const PantryScreen = (_props: MyTabsScreenProps<'Pantry'>) => {
  return <View />;
};

const MealPlanScreen = (_props: MyTabsScreenProps<'MealPlan'>) => {
  return <View />;
};

const ProfileScreen = (_props: MyTabsScreenProps<'Profile'>) => {
  return <View />;
};

const SettingsScreen = (_props: MyTabsScreenProps<'Settings'>) => {
  return <View />;
};

const Tab = createBottomTabNavigator<MyTabsParamList>();

const MyTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="List"
      screenOptions={{
        tabBarMaxVisibleTabs: 5,
      }}
    >
      <Tab.Screen name="List" component={ListScreen} />
      <Tab.Screen name="Recipe" component={RecipeScreen} />
      <Tab.Screen name="Pantry" component={PantryScreen} />
      <Tab.Screen
        name="MealPlan"
        options={{ title: 'Meal Plan' }}
        component={MealPlanScreen}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
