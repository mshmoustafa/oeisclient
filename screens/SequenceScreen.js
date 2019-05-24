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
      // headerRight: (<Button title="Open..." onPress={() => Linking.openURL("https://oeis.org/" + navigation.getParam("title", "Sequence")).catch((err) => console.warn('An error occurred', err))} />),
      headerRight: (<MyShareButton title="Share" shareTitle={navigation.getParam("title", "Sequence")} url={"https://oeis.org/" + navigation.getParam("title", "Sequence")} />),
      // headerRight: (<MyShareButton title="Open..." url={"https://oeis.org/"} />),
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
      // let keyword = sequence.keyword;
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
            // {key: "author", body: <View><Text selectable={true}>{Utility.stripUnderscoresFromAuthor(author)}</Text><AsyncComponent asyncComponent={Utility.convertAuthorToButtons} arguments={author} /></View>}
            // {key: "author", body: <View><Text onPress={() => console.warn("Tapped some text")}>{Utility.stripUnderscoresFromAuthor(author)}</Text>{Utility.convertAuthorToButtons(author)}</View>}
            {key: "author", body: <Text>{Utility.convertAuthorToLinkText(author, this.authorTapped)}</Text>}
            // {key: "author", body: [<Button key="asdf" title="Number Man" onPress={() => {Utility.convertAuthorToButtons("_N. J. A. Sloane_, 1964"); console.warn("Button pressed");}}/>]}
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
    // let sequence = this.props.navigation.getParam("sequence");
    // if (sequence === undefined || sequence === null) {
      // sequence = "Didn't get a sequence!";
    // } else {
      // sequence = sequence.number.toString();
    // }
    // return (
      // <View>
        // <Text>{sequence}</Text>
      // </View>
    // );
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
    // return <Text>Body: {item.item.body}</Text>
    return (
      <ListCell
        style={styles.listCell}
        body={item.item.body}
        onPress={item.item.onPress} />
    );
  }

  _renderSectionHeader = (section) => {
    if (section.section.title === undefined) {
      return;
    } else {
      return <Text style={styles.sectionHeader}>{section.section.title}</Text>
    }
  }

  _makeOnPressFor = (title, property, items) => {
    let params = {
      title: title,
      property: property,
      items: items,
    };
    return ( () => this.props.navigation.push("Detail", params) );
  }

  authorTapped = (author) => {
    console.warn(author);
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
  listCell: {
    backgroundColor: "white",
  },
});
