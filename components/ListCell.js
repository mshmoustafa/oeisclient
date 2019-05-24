import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight, TouchableNativeFeedback, Platform} from 'react-native';

/**
* @class ListCell {React.Component}
*
* @property key {number} An optional unique number that uniquely identifies this cell. It is required if you will be putting the cell in an array.
* @property header {string} A large, bold heading at the top of the cell.
* @property subHeader {string} A subheading to display under the heading.
* @property body {string} The body text of the cell.
*/
const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight
class ListCell extends React.PureComponent {
  render() {
    let headerView;
    if (this.props.header !== undefined) {
      headerView = (
        <Text style={styles.cardHeader}>{this.props.header}</Text>
      );
    }
    let subHeaderView;
    if (this.props.subHeader !== undefined) {
      subHeaderView = (
        <Text style={styles.cardSubHeader}>{this.props.subHeader}</Text>
      );
    }
    let bodyView;
    if (this.props.body !== undefined) {
      let bodySeparator;
      if (this.props.header === undefined && this.props.subHeader === undefined) {
        bodySeparator = undefined;
      } else {
        bodySeparator = styles.bodySeparator;
      }
      if (typeof this.props.body === "string") {
        bodyView = (
          <View style={bodySeparator}>
            <Text style={styles.cardBody}>{this.props.body}</Text>
          </View>
        );

      } else {
        bodyView = (
          <View style={[bodySeparator, styles.cardbody]}>
            {this.props.body}
          </View>
        );
      }
    }
    let cardStyles = this.props.disabled ? [styles.card, styles.disabled] : [styles.card];
    return (
      <View style={styles.cellSeparator}>
        <Touchable
          onPress={this.props.onPress}>
          <View style={cardStyles}>
            <View>
              {headerView}
              {subHeaderView}
              {bodyView}
            </View>
          </View>
        </Touchable>
      </View>
    );
  }
}

class ListCellSeparator extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  bodySeparator: {
    borderTopColor: "#eee",
    borderTopWidth: 1,
    borderStyle: "solid",
    paddingTop: 5,
  },
  card: {
    padding: 20,
    backgroundColor: "white"
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
  },
  disabled: {
    opacity: 0.5
  }
});

export { ListCell, ListCellSeparator };
