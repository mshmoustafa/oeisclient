import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SearchScreen from '../screens/SearchScreen';
import SequenceScreen from '../screens/SequenceScreen';
import DetailScreen from '../screens/DetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpScreen from "../screens/HelpScreen";
import LicensesScreen from "../screens/LicensesScreen";

const SearchStack = createStackNavigator({
  Search: SearchScreen,
  Sequence: SequenceScreen,
  Detail: DetailScreen,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="search" />
  ),
};

// const HistoryStack = createStackNavigator({
//   History: HistoryScreen,
//   Sequence: SequenceScreen,
//   Detail: DetailScreen,
// });

// HistoryStack.navigationOptions = {
//   tabBarLabel: 'History',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       name="history" />
//   ),
// };

// const SettingsStack = createStackNavigator({
//   Settings: SettingsScreen,
// });

// SettingsStack.navigationOptions = {
//   tabBarLabel: 'Settings',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       name="settings" />
//   ),
// };

const HelpStack = createStackNavigator({
  Help: HelpScreen,
  Licenses: LicensesScreen,
});

HelpStack.navigationOptions = {
  tabBarLabel: 'Help',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="help" />
  ),
};

export default createBottomTabNavigator({
  SearchStack,
  // HistoryStack,
  // SettingsStack,
  HelpStack,
});
