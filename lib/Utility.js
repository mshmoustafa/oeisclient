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
      var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
      	if (error) {
          // Parser error
          console.error("Error parsing HTML");
        }
      	else {
          // Parsing done
          return;
        }
      });
      var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
      parser.parseComplete(text);
      // I use a for loop rather than the fancy forEach method of Array because the index is needed anyway to make unique keys for the links.
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
