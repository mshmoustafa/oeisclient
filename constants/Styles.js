import React, {StyleSheet, Platform} from 'react-native'
import Colors from './Colors';

export default StyleSheet.create({
  monospace: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "space-mono",
  },
  active: {
    color: Colors.tintColor,
  }
});
