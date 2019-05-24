import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  SectionList,
  Button,
  Linking,
} from 'react-native';
import Utility from '../lib/Utility';
import { ListCell, ListCellSeparator } from '../components/ListCell';
import { AsyncComponent } from '../components/AsyncComponent';
import MyShareButton from '../components/ShareButton';
import Styles from '../constants/Styles';

export default class SequenceScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Sequence"),
      headerRight: (<MyShareButton title="Share" shareTitle={navigation.getParam("title", "Sequence")} url={"https://oeis.org/" + navigation.getParam("title", "Sequence")} />),
    };
  };


  render() {
    let sequence = this.props.navigation.getParam("sequence");
    let sections = [];
    if (sequence !== undefined || sequence !== null) {
      let number = Utility.prettifyNumber(sequence.number);
      let name = sequence.name;
      let data = Utility.addSpacesBetweenCommas(sequence.data);
      let keyword = Utility.addSpacesBetweenCommas(sequence.keyword);
      let author = sequence.author;
      let offset = sequence.offset;
      sections = [
        {
          title: "ID Number",
          data: [
            {key: "id", body: <Text selectable={true}>{number}</Text>},
          ]
        },
        {
          title: "Name",
          data: [
            {key: "name", body: <Text selectable={true}>{name}</Text>}
          ]
        },
        {
          title: "Data",
          data: [
            {key: "data", body: <Text selectable={true} style={Styles.monospace}>{data}</Text>}
          ]
        },
        {
          title: "Offset",
          data: [
            {key: "offset", body: <Text selectable={true} style={Styles.monospace}>{offset}</Text>}
          ]
        },
        {
          title: "Keywords",
          data: [
            {key: "keywords", body: <Text selectable={true}>{keyword}</Text>}
          ]
        },
        {
          title: "Author",
          data: [
            {key: "author", body: <Text>{Utility.convertAuthorToLinkText(author, this.authorTapped)}</Text>}
          ]
        },
        {
          title: "Details",
          data: [
            {
              key: "comment",
              body: "Comments",
              onPress: this._makeOnPressFor("Comments", "comment", sequence.comment),
            },
            {
              key: "reference",
              body: "References",
              onPress: this._makeOnPressFor("References", "reference", sequence.reference),
            },
            {
              key: "link",
              body: "Links",
              onPress: this._makeOnPressFor("Links", "link", sequence.link),
            },
            {
              key: "formula",
              body: "Formulas",
              onPress: this._makeOnPressFor("Formulas", "formula", sequence.formula),
            },
            {
              key: "example",
              body: "Examples",
              onPress: this._makeOnPressFor("Examples", "example", sequence.example),
            },
            {
              key: "mathematica",
              body: "Mathematica",
              onPress: this._makeOnPressFor("Mathematica", "mathematica", sequence.mathematica),
            },
            {
              key: "maple",
              body: "Maple",
              onPress: this._makeOnPressFor("Maple", "maple", sequence.maple),
            },
            {
              key: "program",
              body: "Programs",
              onPress: this._makeOnPressFor("Programs", "program", sequence.program),
            },
            {
              key: "xref",
              body: "Crossrefs",
              onPress: this._makeOnPressFor("Crossrefs", "xref", sequence.xref),
            },
          ]
        },
      ];
    }
    return (
      <View style={styles.base}>
        <SectionList
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          ItemSeparatorComponent={() => <ListCellSeparator />}
          keyExtractor={(item, index) => item.key}
          sections={sections} />
      </View>
    );
  }

  _renderItem = (item, index, section) => {
    if (item.item.onPress !== null) {
      return (
        <ListCell
          body={item.item.body}
          onPress={item.item.onPress} />
      );
    } else {
      // If onPress is null, then that means it was set to null in _makeOnPressFor and therefore there are no entries for that section, so disable that section's button and apply a disabled style to it.
      return (
        <ListCell
          disabled={true}
          body={item.item.body} />
      );
    }
  }

  _renderSectionHeader = (section) => {
    if (section.section.title === undefined) {
      return;
    } else {
      return <Text style={styles.sectionHeader}>{section.section.title}</Text>
    }
  }

  _makeOnPressFor = (title, property, items) => {
    if (items !== null && items !== undefined && items.length > 0) {
      let params = {
        title: title,
        property: property,
        items: items,
      };
      return ( () => this.props.navigation.push("Detail", params) );
    } else {
      // If there are no items, don't make an onPress handler, effectively disabling that button.
      return null;
    }
  }

  authorTapped = (author) => {
    console.log(author);
    let preparedAuthor = Utility.stripUnderscoresFromAuthor(author).split(" ").join("_");
    let url = "https://www.oeis.org/wiki/User:" + preparedAuthor;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  sectionHeader: {
    fontWeight: "500",
    backgroundColor: "#efefef",
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
