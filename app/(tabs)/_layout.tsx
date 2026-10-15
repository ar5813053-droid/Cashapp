import React from 'react';
import { withLayoutContext } from 'expo-router';
import {
  createMaterialTopTabNavigator,
  type MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { FloatingTabBar } from '../../src/components/FloatingTabBar';
import { colors } from '../../src/design/tokens';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator
>(Navigator);

export default function TabsLayout() {
  return (
    <MaterialTopTabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      tabBarPosition="bottom"
      initialRouteName="index"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        lazy: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <MaterialTopTabs.Screen name="recipients" options={{ title: 'Recipients' }} />
      <MaterialTopTabs.Screen name="index" options={{ title: 'Home' }} />
      <MaterialTopTabs.Screen name="cards" options={{ title: 'Cards' }} />
      <MaterialTopTabs.Screen name="market" options={{ title: 'Market' }} />
    </MaterialTopTabs>
  );
}
