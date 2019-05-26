import React from 'react';
import {
  Text,
  StyleSheet,
  Linking,
} from 'react-native';

export default class LinkText extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={{color: "blue"}}
        onPress={
          () => {
            Linking.openURL(this.props.href).catch((err) => console.error("An error occurred", err));
          }
        } />
    );
  }
}
