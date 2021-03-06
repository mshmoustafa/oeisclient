import React from 'react';
import {
  View,
  Text,
  FlatList,
  Linking,
  StyleSheet
} from 'react-native';
import SimpleList from '../components/List';
import { ListCell, ListCellSeparator } from '../components/ListCell';
import Utility from '../lib/Utility';
import {OEIS, OEISResponse, OEISSequence} from "../lib/oeis";
import Styles from '../constants/Styles.js';

export default class DetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Sequence"),
    };
  };

  render() {

    let propertyString = this.props.navigation.getParam("property");
    if (propertyString === "maple" || propertyString === "mathematica" || propertyString === "program") {
      // Use monospace font and maybe some special formatting
      let key = 0;
      let cellContents = "";
      let items = this.props.navigation.getParam("items");
      if (items !== null && items !== undefined && items.length > 0) {
        items.forEach((element) => {
          cellContents = cellContents + element + "\n";
        });
        return (
          <FlatList
            style={styles.base}
            data={[{key: key, body: cellContents}]}
            renderItem={this._renderProgram}
            ItemSeparatorComponent={() => <ListCellSeparator />}
            keyExtractor={ (item) => item.key.toString() } />
        );
      } else {
        return (
          <View style={styles.noEntriesView}>
            <Text style={styles.noEntriesText}>No entries</Text>
          </View>
        );
      }
    } else {
      // Use normal font and normal formatting
      let key = 0;
      let cellContents = [];
      let items = this.props.navigation.getParam("items");
      if (items !== null && items !== undefined && items.length > 0) {
        items.forEach((element) => {
          cellContents.push({
            key: key,
            body: element,
          })
          key = key + 1;
        })
        return (
          <FlatList
            style={styles.base}
            data={cellContents}
            renderItem={this._renderItem}
            ItemSeparatorComponent={() => <ListCellSeparator />}
            keyExtractor={ (item) => item.key.toString() } />
        );
      } else {
        return (
          <View style={styles.noEntriesView}>
            <Text style={styles.noEntriesText}>No entries</Text>
          </View>
        );
      }
    }
  }

  _renderItem = ({item}) => {
    let bodyWithParsedLinks = [];
    if (this.props.navigation.getParam("property") === "link") {
      bodyWithParsedLinks = Utility.convertLinksToTextLinks(item.body, this.linkTapped);
    } else {
      bodyWithParsedLinks = [item.body];
    }
    let bodyWithParsedLinksAndSequences = [];
    bodyWithParsedLinks.forEach(element => {
      if (typeof element === "string") {
        let parsedSequencesArray = Utility.convertIDToLinkText(element, this.sequenceIDTapped);
        bodyWithParsedLinksAndSequences = bodyWithParsedLinksAndSequences.concat(parsedSequencesArray);
      } else {
        bodyWithParsedLinksAndSequences.push(element);
      }
    });
    let bodyWithParsedLinksAndSequencesAndAuthors = [];
    bodyWithParsedLinksAndSequences.forEach(element => {
      if (typeof element === "string") {
        let parsedAuthorsArray = Utility.convertAuthorToLinkText(element, this.authorTapped);
        bodyWithParsedLinksAndSequencesAndAuthors = bodyWithParsedLinksAndSequencesAndAuthors.concat(parsedAuthorsArray);
      } else {
        bodyWithParsedLinksAndSequencesAndAuthors.push(element);
      }
    });
    let body = (
      <View>
        <Text selectable={true}>{bodyWithParsedLinksAndSequencesAndAuthors}</Text>
      </View>
    )
    return (
      <ListCell
        style={styles.listCell}
        key={item.key}
        body={body} />
    );
  }

  _renderProgram = ({item}) => {
    let body = (
      <View>
        <Text selectable={true} style={Styles.monospace}>{item.body}</Text>
      </View>
    )
    return (
      <ListCell
        style={styles.listCell}
        key={item.key}
        body={body} />
    );
  }

  authorTapped = (author) => {
    console.log(author);
    let preparedAuthor = Utility.stripUnderscoresFromAuthor(author).split(" ").join("_");
    let url = "https://www.oeis.org/wiki/User:" + preparedAuthor;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  linkTapped = (url) => {
    console.log(url);
    if (url.charAt(0) === "/") {
      Linking.openURL("https://oeis.org" + url).catch((err) => console.error('An error occurred', err));
    } else {
      Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }
  }

  sequenceIDTapped = (sequenceID) => {
    console.log("in _sequenceIDTapped");
    console.log("    Sequence: " + sequenceID.toString());
    if (sequenceID.trim() === "") {
      console.log("    Search query was empty, doing nothing");
      return;
    }
    // TODO: show a progress bar
    let _oeis = new OEIS("english", false);
    _oeis.searchByID(sequenceID, "json", (/** @type {OEISResponse} */ results) => {
      console.log("in searchByID Callback");
      console.log("    " + results.greeting);
      console.log("    Retrieved " + results.count + " results.");
      this.props.navigation.push("Sequence", {
        sequence: results.results[0],
        title: Utility.prettifyNumber(results.results[0].number.toString()),
      });
    });
  }
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#f9f9f9",
  },
  listCell: {
    backgroundColor: "white",
  },
  noEntriesView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEntriesText: {
    color: "#666",
  }
});
