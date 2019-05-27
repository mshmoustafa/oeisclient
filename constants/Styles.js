import React, {StyleSheet, Platform} from 'react-native'
import Colors from './Colors';

export default StyleSheet.create({
  monospace: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "Droid Sans Mono",
  },
  active: {
    color: Colors.tintColor,
  }
});
