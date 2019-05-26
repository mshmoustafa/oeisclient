import React from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import Card from '../components/Card';
import SimpleList from '../components/List';
import Colors from '../constants/Colors.js';
import Styles from '../constants/Styles.js';

export default class HelpScreen extends React.Component {
  static navigationOptions = {
    title: "Help"
  };

  state = {}

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.base}>
        {this._body()}
      </View>
    );
  }

  _body = () => {
    console.log("in _introView");
    console.log("    making the intro view...");
    let key = 0;
    let listViewContents = [
      {
        key: 0,
        header: "Getting Started",
        body: "To search the OEIS, enter a search query in the search bar."
      },
      {
        key: 1,
        header: "Advanced Searching",
        body: <Text>Searching in this app is very similar to searching on the OEIS website. For example, to search for the sequence with an ID of <Text style={Styles.monospace}>A000045</Text>, type <Text style={Styles.monospace}>id:A000045</Text> in the search bar and tap Search. For more info on searching, refer to the OEIS hints webpage.</Text>
      },
      {
        key: 2,
        header: "Getting Started",
      },
    ];
    let list = (
      <SimpleList
        useCards={true}
        items={listViewContents} />
    );
    return list;
  }
}

class LinkText extends React.Component {
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

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  minorText: {
    fontSize: 15,
    color: "#666",
  },
});
