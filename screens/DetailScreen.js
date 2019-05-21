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
// import FastHTMLParser from "fast-html-parser";

export default class DetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Sequence"),
    };
  };

  render() {

    // var root = FastHTMLParser.parse('<ul id="list"><li>Hello World</li></ul>');

    // console.warn(root.firstChild.structure);

    let propertyString = this.props.navigation.getParam("property");
    if (propertyString === "maple" || propertyString === "mathematica" || propertyString === "program") {
      // Use monospace font and maybe some special formatting
    } else {
      // Use normal font and normal formatting
    }
    let key = 0;
    let cellContents = [];
    let items = this.props.navigation.getParam("items");
    // console.warn("items " + items.length);
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
    // let body = item.body.replace(Utility.regexAuthor, Utility.convertAuthorToLinkOriginal);
    // let body = Utility.convertAuthorToLink(item.body);

    // let body = (
    //   <View>
    //     <Text>{item.body}</Text>
    //     {Utility.convertAuthorToButtons(item.body)}
    //   </View>
    // )

    // let body = (
    //   <View>
    //     <Text>{item.body}</Text>
    //     <AsyncComponent asyncComponent={Utility.convertAuthorToButtons} arguments={item.body} />
    //   </View>
    // )

    // let body = (
    //   <View>
    //     <Text>{item.body}</Text>
    //   </View>
    // )

    // let body = (
    //   <View>
    //     <Text>{item.body.replace(Utility.regexAuthor, Utility.convertAuthorToLinkOriginal)}</Text>
    //   </View>
    // )

    // let body = (
    //   <View>
    //     <Text>{Utility.convertAuthorToLinkText(item.body)}</Text>
    //   </View>
    // )
    // console.log("Rendering item");
    // console.log(item.body);
    let bodyWithParsedLinks = Utility.convertLinksToTextLinks(item.body, this.linkTapped);
    // console.log(bodyWithParsedLinks);
    let bodyWithParsedLinksAndSequences = [];
    bodyWithParsedLinks.forEach(element => {
      if (typeof element === "string") {
        let parsedSequencesArray = Utility.convertIDToLinkText(element, this.sequenceIDTapped);
        bodyWithParsedLinksAndSequences = bodyWithParsedLinksAndSequences.concat(parsedSequencesArray);
      } else {
        bodyWithParsedLinksAndSequences.push(element);
      }
    });
    // console.log(bodyWithParsedLinksAndSequences);
    let bodyWithParsedLinksAndSequencesAndAuthors = [];
    bodyWithParsedLinksAndSequences.forEach(element => {
      if (typeof element === "string") {
        let parsedAuthorsArray = Utility.convertAuthorToLinkText(element, this.authorTapped);
        bodyWithParsedLinksAndSequencesAndAuthors = bodyWithParsedLinksAndSequencesAndAuthors.concat(parsedAuthorsArray);
      } else {
        bodyWithParsedLinksAndSequencesAndAuthors.push(element);
      }
    });
    // console.log(bodyWithParsedLinksAndSequencesAndAuthors);
    let body = (
      <View>
        <Text selectable={true}>{bodyWithParsedLinksAndSequencesAndAuthors}</Text>
      </View>
    )
    // console.warn(body);
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
    // this.setState(previousState => ({activityIndicatorVisible: true}));
    let _oeis = new OEIS("english", false);
    _oeis.searchByID(sequenceID, "json", (/** @type {OEISResponse} */ results) => {
      console.log("in searchByID Callback");
      console.log("    " + results.greeting);
      console.log("    Retrieved " + results.count + " results.");
      // setTimeout(() => {
      //   this.setState(previousState => ({
      //     lastSearch: text,
      //     currentPage: currentPage,
      //     searchResults: results,
      //     activityIndicatorVisible: false
      //   }));
      // }, 1000);
      this.props.navigation.push("Sequence", {
        sequence: results.results[0],
        title: Utility.prettifyNumber(results.results[0].number.toString()),
      });
    });
  }
}
