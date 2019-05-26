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
        header: "What happened to the text size setting?",
        body: "Text size is now controlled by your device's accessibility settings."
      },
      {
        key: 4,
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
        header: "About",
        body: <Text>Neither this app nor the developer are affiliated with the Online Encyclopedia of Integers (<LinkText href="https://oeis.org">https://oeis.org</LinkText>). All of the sequences and related information are retrieved from the OEIS. OEIS and THE ON-LINE ENCYCLOPEDIA OF INTEGER SEQUENCES are trademarks of The OEIS Foundation Inc. More information can be found at <LinkText href="https://oeisf.org">https://oeisf.org</LinkText>.</Text>
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
