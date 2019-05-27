import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight, TouchableNativeFeedback, Platform} from 'react-native';

/**
* @class Card {React.Component}
*
* @property key {number} An optional unique number that uniquely identifies this card. It is required if you will be putting the card in an array.
* @property header {string} A large, bold heading at the top of the card.
* @property subHeader {string} A subheading to display under the heading.
* @property body {string} The body text of the card.
*/
export default class Card extends React.Component {
  render() {
    let headerView;
    if (this.props.header !== undefined) {
      headerView = (
        <Text style={styles.cardHeader}>
          {this.props.header}
        </Text>
      );
    }
    let subHeaderView;
    if (this.props.subHeader !== undefined) {
      subHeaderView = (
        <Text style={styles.cardSubHeader}>
          {this.props.subHeader}
        </Text>
      );
    }
    let bodyView;
    if (this.props.body !== undefined) {
      let bodyStyle = [];
      bodyView = (
        <View style={(headerView || subHeaderView) ? styles.separator : []}>
          <Text style={styles.cardBody}>
            {this.props.body}
          </Text>
        </View>
      );
    }
    const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight

    // On Android, TouchableNativeFeedback visually shows a touch regardless of whether onPress is null, which is very annoying and confusing for the user.
    // The only way I know how to avoid this is by not including a TouchableNativeFeedback component in the tree, which results in this ugly if statement.
    if (this.props.onPress) {
      return (
        <View style={styles.cardContainer}>
          <Touchable
            style={{borderRadius: 3}}
            onPress={this.props.onPress}>
            <View style={styles.card}>
              <View>
                {headerView}
                {subHeaderView}
                {bodyView}
              </View>
            </View>
          </Touchable>
        </View>
      );
    } else {
      return (
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View>
              {headerView}
              {subHeaderView}
              {bodyView}
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 3,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  separator: {
    borderTopColor: "#eee",
    borderTopWidth: 1,
    borderStyle: "solid",
    paddingTop: 5,
  },
  card: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 3,
  },
  cardHeader: {
    fontSize: 22,
    fontWeight: "500",
    paddingBottom: 5
  },
  cardSubHeader: {
    fontSize: 21,
    paddingBottom: 5
  },
  cardBody: {
    fontSize: 18
  }
});
