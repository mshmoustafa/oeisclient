import React from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import { ListCell, ListCellSeparator } from './ListCell.js';

/**
* @class ListPicker {React.Component}
*
* @property key {number} An optional unique number that uniquely identifies this card. It is required if you will be putting the card in an array.
* @property header {string} A large, bold heading at the top of the card.
* @property subHeader {string} A subheading to display under the heading.
* @property body {string} The body text of the card.
*/
export default class ListPicker extends React.Component {
  render() {
    return (
      <FlatList
        data={this.props.items}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._renderItemSeparator}
        ListHeaderComponent={this.props.headerComponent}
        ListFooterComponent={this.props.footerComponent}
        keyExtractor={ (item) => item.key.toString() } />
    );
  }

  _renderItem = ({item}) => {
    return (
      <ListCell
        key={item.key}
        header={item.header}
        subHeader={item.subHeader}
        body={<Text style={{textAlign: "center"}}>{item.body}</Text>}
        onPress={() => {this.props.onItemPress(item.key)}} />
    );
  };

  _renderItemSeparator = () => {
    return (<ListCellSeparator />);
  }
}

const styles = StyleSheet.create({
});
