import React from 'react';
import {
  View,
  Text,
  FlatList,
  Linking,
} from 'react-native';
import SimpleList from '../components/List';
import { ListCell, ListCellSeparator } from '../components/ListCell';
import { AsyncComponent } from '../components/AsyncComponent';
import Utility from '../lib/Utility';
import {OEIS, OEISResponse, OEISSequence} from "../lib/oeis";

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
    } else {
      // Use normal font and normal formatting
    }
    let key = 0;
    let cellContents = [];
    let items = this.props.navigation.getParam("items");
    items.forEach((element) => {
      cellContents.push({
        key: key,
        body: element,
      })
      key = key + 1;
    })
    return (
      <FlatList
        data={cellContents}
        renderItem={this._renderItem}
        ItemSeparatorComponent={() => <ListCellSeparator />}
        keyExtractor={ (item) => item.key.toString() } />
    );
  }

  _renderItem = ({item}) => {
    let bodyWithParsedLinks = Utility.convertLinksToTextLinks(item.body, this.linkTapped);
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
        key={item.key}
        body={body} />
    );
  }

  authorTapped = (author) => {
    console.warn(author);
    let preparedAuthor = Utility.stripUnderscoresFromAuthor(author).split(" ").join("_");
    let url = "https://www.oeis.org/wiki/User:" + preparedAuthor;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  linkTapped = (url) => {
    console.warn(url);
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
