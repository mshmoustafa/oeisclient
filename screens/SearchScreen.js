import React from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import OEIS from "../lib/oeis";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Search",
  };

  state = {
    text: "",
  }

  render() {
    return (
      <ScrollView
        style={{padding: 10}}>
        <TextInput
          style={{
            height: 40,
            backgroundColor: "orange",
          }}
          placeholder="Search the OEIS"
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={() => this._submitQuery(this.state.text)}
        />
        <Button
          title="Search"
          onPress={this._searchButtonPressed}
        />
      </ScrollView>
    );
  }

  _searchButtonPressed = () => {
    console.info("Search Button Tapped");
    this._submitQuery(this.state.text);
  }

  _submitQuery = (text) => {
    console.log("Search query: " + text);
    if (text === "") {
      console.log("Search query was empty, doing nothing");
      return;
    }
    defaultOEIS.searchByQuery(text, "json", function(results) {
      console.log(results.greeting);
    })
  }
}