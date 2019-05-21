import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
// import FastHTMLParser from "fast-html-parser";
// var DOMParser = require('xmldom').DOMParser;
var htmlparser = require("htmlparser");

/**
 * Contains various utility functions.
 */
var Utility = /** @class */ (function () {
    function Utility() {
    }
    /**
     * Adds spaces between a comma-separated string. e.g. a,b,c,d -> a, b, c, d
     * @param {string} the_string - the string
     * @return {string} the string with spaces after commas
     */
    Utility.addSpacesBetweenCommas = function (the_string) {
        return the_string.replace(/,/g, ", ");
    };
    /**
     * Converts a number to six-digit format found on OEIS. e.g. 45 -> A000045
     * @param {number} number - the number to convert
     * @return {string} the six digit number as a string
     */
    Utility.prettifyNumber = function (number) {
        var prettyNumber = number.toString().padStart(6, "0");
        prettyNumber = "A" + prettyNumber;
        return prettyNumber;
    };
    /**
     * Preserves spaces in a string by using the character code. To be used with regex functions (e.g. replace)
     * @return {string} the new string
     */
    Utility.preserveLeadingSpacesAsText = function () {
        var leadingSpaces = arguments[0].length;
        var str = "";
        while (leadingSpaces > 0) {
            str += "\xa0";
            leadingSpaces--;
        }
        return str;
    };
    /**
     * Preserves spaces in a string by using the HTML code. To be used with regex functions (e.g. replace)
     * @return {string} the new string
     */
    Utility.preserveLeadingSpacesAsHTML = function () {
        var leadingSpaces = arguments[0].length;
        var str = "";
        while (leadingSpaces > 0) {
            str += "&nbsp;";
            leadingSpaces--;
        }
        return str;
    };
    /**
     * Turns an author string of the format \_name\_ into a link.
     * To be used in a regex.
     */
    Utility.convertAuthorToLinkOriginal = function () {
        let x = arguments[0];
        // Removes the second and second-to-last characters.
        // x = x.slice(0,1) + x.slice(2, -2) + x.slice(-1);
        x = x.slice(1, -1);
        let nice = x + "";
        // console.warn(nice);
        // x.replace(/ /g, "_");
        x = x.split(" ").join("_");
        x = "https://oeis.org/wiki/User:" + x;
        // x = "<a href='" + x + "'>" + nice + "</a>";
        let link = (<Text onPress={() => {console.warn('hi');}} style={{color: 'blue'}}>{nice}</Text>);
        return link;
    };
    Utility.convertAuthorToLinkText = (string, theCallback) => {
      let strings = [];
      let author = [];
      strings = string.split(Utility.regexAuthor);
      while (matched = Utility.regexAuthor.exec(string)) {
        author.push(matched[0]);
      }
      let merged = [];
      let max = strings.length > author.length ? strings.length : author.length;
      for (let i = 0; i < max; i++) {
        if (i < strings.length) {
          // let component = <Text key={i}>{strings[i]}</Text>
          let component = strings[i];
          merged.push(component);
        }
        if (i < author.length) {
          let component = (
            <Text
              key={"author" + i.toString()}
              style={{color: "blue"}}
              onPress={() => theCallback(author[i])}>
              {Utility.stripUnderscoresFromAuthor(author[i])}
            </Text>
          );
          merged.push(component);
        }
      }
      return merged;
    }
    /** Pulls out authors as buttons */
    Utility._convertAuthorToButtons = function(string) {
      let authorButtons = [];
      while (matched = Utility.regexAuthor.exec(string)) {
        // let matched = ["_N. J. A. Sloane_"];
        let author = matched[0];
        let authorWithoutUnderscores = Utility.stripUnderscoresFromAuthor(author);
        authorButtons.push(<Button key={Math.random().toString()} title={authorWithoutUnderscores} onPress={() => console.warn("Author button pressed: " + authorWithoutUnderscores)} />);
      }
      // console.log(authorButtons);
      return <View style={{flex: 1, flexWrap: "wrap", alignItems: "flex-start"}}>{authorButtons}</View>;
    }
    Utility.convertAuthorToButtons = function(string) {
      return Utility._convertAuthorToButtons(string);
    }
    Utility.stripUnderscoresFromAuthor = function(author) {
      return author.slice(1, -1);
    }
    Utility.convertIDToLink = function () {
        var x = arguments[0];
        x = "<a href='#' class='sequence-link'>" + x + "</a>";
        return x;
    };
    Utility.convertIDToLinkText = (string, callback) => {
      let strings = [];
      let sequence = [];
      strings = string.split(Utility.regexSequenceID);
      while (matched = Utility.regexSequenceID.exec(string)) {
        sequence.push(matched[0]);
      }
      let merged = [];
      let max = strings.length > sequence.length ? strings.length : sequence.length;
      for (let i = 0; i < max; i++) {
        if (i < strings.length) {
          // let component = <Text key={i}>{strings[i]}</Text>
          let component = strings[i];
          merged.push(component);
        }
        if (i < sequence.length) {
          let component = (
            <Text
              key={"id" + i.toString()}
              style={{color: "blue"}}
              onPress={() => callback(sequence[i])}>
              {sequence[i]}
            </Text>
          )
          merged.push(component);
        }
      }
      return merged;
    }

    // For examples of how the parsed DOM looks, go to https://github.com/tautologistics/node-htmlparser
    Utility.convertLinksToTextLinks = (text, onPress) => {
      let textComponents = [];
      // let root = FastHTMLParser.parse("<p>" + text + "</p>");
      // console.log(text);
      var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
      	if (error) {
      		// [...do something for errors...]
        }
      	else {
      		// [...parsing done, do something...]
        }
      });
      var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
      parser.parseComplete(text);
      // console.log(JSON.stringify(handler.dom));
      // console.warn(JSON.stringify(handler.dom));
      // var rawHtml = "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->";
      // var handler = new htmlparser.DefaultHandler(function (error, dom) {
      // 	if (error) {
      //     return;
      // 	} else {
      //     return;
      //   }
      // });
      // var parser = new htmlparser.Parser(handler);
      // parser.parseComplete(rawHtml);
      // let root = new DOMParser().parseFromString("<p>" + text + "</p>",'text/html');
      // let root = new DOMParser().parseFromString("<p>Hello, <b>There</b>.</p>",'text/html');
      // let root = new DOMParser().parseFromString('<p>R. S. Melahm, <a href="https://cs.uwaterloo.ca/journals/JIS/VOL18/Melham/melham8.html">Reciprocal Series of Squares of Fibonacci Related Sequences with Subscripts in Arithmetic Progression</a>, J. Int. Seq. 18 (2015) 15.8.7.<p>','text/html');
      // let firstChild = root.firstChild;
      // let childNodes = firstChild.childNodes;
      // console.log(root);
      // let i = 0;
      for (let i = 0; i < handler.dom.length; i++) {
        let element = handler.dom[i];
        if (element.name === "a") {
          let linkText = (
            <Text
              key={"link" + i.toString()}
              style={{color: "blue"}}
              onPress={() => onPress(element.attribs.href)}>
              {element.children[0].data}
            </Text>
          );
          textComponents.push(linkText);
          // i = i + 1;
        } else if (element.type === "text") {
          textComponents.push(element.data);
        }
      }
      // root.firstChild.childNodes.forEach(element => {
      //   if (element.tagName === "a") {
      //     let linkText = (
      //       <Text
      //         key={"link" + i.toString()}
      //         style={{color: "blue"}}
      //         onPress={() => onPress(element.attributes.href)}>
      //         {element.text}
      //       </Text>
      //     );
      //     textComponents.push(linkText);
      //     i = i + 1;
      //   } else if (element.rawText !== undefined && element.rawText !== null) {
      //     textComponents.push(element.rawText);
      //   }
      // });
      return textComponents;
    }
    /**
     * A regular expression to find names of the format "\_Some name\_"
     * Allows for periods, spaces, and numbers in the name but no special characters (unfortunately, this also means letters with diacritics).
     */
    Utility.regexAuthor = new RegExp(/_[a-zA-Z\.\-]+\s+[\w\s\.\-]*_/gm);
    /**
     * A regular expression to find chunks of whitespace (1 or more)
     */
    Utility.regexSpaces = new RegExp(/^[ \t]+/gm);
    /**
     * A regular expression to find id's of the form A000000
     */
    Utility.regexSequenceID = new RegExp(/A\d\d\d\d\d\d/gm);
    return Utility;
}());

export default Utility;
