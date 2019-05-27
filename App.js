/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
* @lint-ignore-every XPLATJSCOPYRIGHT1
*/

import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import AppNavigator from './navigation/AppNavigator';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
