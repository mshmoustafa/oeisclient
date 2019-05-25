import React from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Button,
  Text,
  StyleSheet,
  Picker,
  Modal,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {OEIS, OEISResponse, OEISSequence} from "../lib/oeis";
import Utility from '../lib/Utility';
import Card from '../components/Card';
import SimpleList from '../components/List';
import { ListCell, ListCellSeparator } from '../components/ListCell';
import ListPicker from '../components/ListPicker';
import Colors from '../constants/Colors.js';
import Styles from '../constants/Styles.js';

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    title: "Search"
  };

  state = {
    text: "",
    lastSearch: "",
    /** @type {number} */
    currentPage: 0,
    /** @type {OEISResponse} */
    searchResults: undefined,
    pagePickerVisible: false,
    activityIndicatorVisible: false,
  }

  render() {
    const {navigate} = this.props.navigation;
    let body;
    if (this.state.searchResults === undefined) {
      body = this._introView();
    } else {
      body = this._searchResultsListView(this.state.searchResults.results, this.state.searchResults.count);
    }
    let modal1 = (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.activityIndicatorVisible}
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={() => {/* Do nothing since it doesn't make sense to close a loading indicator */}}>
        <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'stretch',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
          <View style={{
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: 10
            }}>
            <ActivityIndicator size="large" color="#222"/>
          </View>
        </View>
      </Modal>
    );
    let modal2 = (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.pagePickerVisible}
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={() => {this.setState({pagePickerVisible: false});}}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}>
          <View style={{minWidth: 150, minHeight: 100, maxHeight: 400, marginTop: 40, marginBottom: 40, backgroundColor: "white", borderColor: "#bbb", borderWidth: 1, borderStyle: "solid"}}>
            <Button
              title="Cancel"
              onPress={() => {this._pagePickerDismissed();}} />
            {this._pagePicker()}
          </View>
        </View>
      </Modal>
    );
    return (
      <View style={styles.base}>
        {modal1}
        {modal2}
        <View style={{flex: 1}}>
          <View>
            <TextInput
              style={[styles.pronouncedBorder, styles.boldTextInput]}
              placeholder="Search the OEIS..."
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              blurOnSubmit={true}
              clearButtonMode="always"
              returnKeyType="search"
              onChangeText={(text) => this.setState(previousState => {
                this.state.text = text;
              })}
              onSubmitEditing={() => this._submitQuery(this.state.text, 0)} />
          </View>
          {body}
        </View>
      </View>
    );
  }

  _setModalVisible = (visible) => {
    console.log("in _setModalVisible");
    this.setState({pagePickerVisible: visible});
  }

  _searchButtonPressed = () => {
    console.log("in _searchButtonPressed");
    console.log("    Search Button Tapped");
    this._submitQuery(this.state.text, 0);
  }

  /**
  * Validates search query from the search bar and performs a search.
  * @param text {string}
  * @param start {number}
  */
  _submitQuery = (text, start) => {
    console.log("in _submitQuery");
    console.log("    Search query: " + text + " and start: " + start.toString());
    if (text.trim() === "") {
      console.log("    Search query was empty, doing nothing");
      return;
    }
    // TODO: show a progress bar
    this.setState(previousState => ({activityIndicatorVisible: true}));
    let _oeis = new OEIS("english", false, true);
    _oeis.searchByQueryAndStart(text, start, "json", (/** @type {OEISResponse} */ results) => {
      console.log("in searchByQueryAndStart Callback");
      console.log("    " + results.greeting);
      console.log("    Retrieved " + results.count + " results.");
      console.log("    Start: " + results.start);
      let currentPage = this._computeCurrentPage(results.start, 10);
      console.log("    Computed current page: " + currentPage.toString());
      setTimeout(() => {
        this.setState(previousState => ({
          lastSearch: text,
          currentPage: currentPage,
          searchResults: results,
          activityIndicatorVisible: false
        }));
      }, 1000);
    });

  }

  _searchFooter = (numberOfHits) => {
    let numberOfPages = this._computeNumberOfPages(numberOfHits);
    let pagePickerString = "Page " + this.state.currentPage + " of " + numberOfPages;
    return (
      <View style={{marginTop: 10, marginBottom: 10}}>
        <Button
          title={pagePickerString}
          onPress={this._pagePickerButtonPressed}/>
      </View>
    );
  }

  _introView = () => {
    console.log("in _introView");
    console.log("    making the intro view...");
    let key = 0;
    let listViewContents = [
      {
        key: 0,
        header: "Getting Started",
        body: "To search the OEIS, enter a search query in the search bar."
      },
      {
        key: 1,
        header: "Advanced Searching",
        body: <Text>Searching in this app is very similar to searching on the OEIS website. For example, to search for the sequence with an ID of <Text style={Styles.monospace}>A000045</Text>, type <Text style={Styles.monospace}>id:A000045</Text> in the search bar and tap Search. For more info on searching, refer to the OEIS hints webpage.</Text>
      },
      {
        key: 2,
        header: "Getting Started",
      },
    ];
    let list = (
      <SimpleList
        useCards={true}
        items={listViewContents} />
    );
    return list;
  }

  /**
  * @param searchResults {Array<number>}
  * @param numberOfHits {number}
  */
  _searchResultsListView = (searchResults, numberOfHits) => {
    console.log("in _searchResultsListView");
    console.log("    making the search results list view...");
    let noResultsText = "No results";
    let shouldShowListFooter = true;
    if (numberOfHits !== null && numberOfHits !== undefined) {
      if (numberOfHits === 0) {
        // There are no search results so hide the page picker.
        shouldShowListFooter = false;
      }
      if (numberOfHits > 0 && (searchResults === null || searchResults === undefined)) {
        // There are too many search results so show an informative error message and hide the page picker.
        noResultsText = "Too many results.\n\nYour search returned too many results (" + numberOfHits + " to be precise.)  Try refining your search.  If this happens frequently and the number of results is not very large, you can report a bug through the settings page.";
        shouldShowListFooter = false;
      }
    } else {
      // numberOfHits is null or undefined so hide the page picker.
      shouldShowListFooter = false;
    }
    let list = (
      <FlatList
        data={searchResults}
        renderItem={this._searchResultCard}
        ItemSeparatorComponent={() => <ListCellSeparator />}
        ListFooterComponent={shouldShowListFooter ? this._searchFooter(numberOfHits) : null}
        ListEmptyComponent={<View style={styles.noResultsView}><Text style={styles.noResultsText}>{noResultsText}</Text></View>}
        keyExtractor={ (item) => item.number.toString() } />
    );
    return list;
  }

  /**
  * @param item {OEISSequence}
  */
  _searchResultCard = ({item}) => {
    console.log("in _searchResultCard");
    console.log("    sequence number: " + item.number.toString());
    let sequenceNumber = Utility.prettifyNumber(item.number);
    console.log("    data: " + item.data.toString());
    let dataWithSpaces = Utility.addSpacesBetweenCommas(item.data);
    return (
      <ListCell
        header={sequenceNumber}
        subHeader={item.name}
        onPress={() => this._searchResultCardTouched(item)}
        body=<Text style={Styles.monospace}>{dataWithSpaces}</Text> />
    );
  }

  _searchResultCardTouched = (item) => {
    console.log("in _searchResultCardTouched");
    console.log("    search result: " + item.number.toString());
    let sequenceNumber = Utility.prettifyNumber(item.number);
    this.props.navigation.navigate("Sequence", {
      sequence: item,
      title: sequenceNumber,
    });
  }

  _pagePicker = () => {
    console.log("in _pagePicker");
    console.log("    making the page picker...");
    if (this.state.searchResults === undefined || this.state.searchResults === null) {
      return undefined;
    }
    let numberOfPages = this._computeNumberOfPages(this.state.searchResults.count);
    let pagePickerItems = [];
    for (let i = 1; i <= numberOfPages; i++) {
      pagePickerItems.push({
        key: i,
        body: i.toString(),
      });
    }
    let pagePicker;
    if (this.state.pagePickerVisible === true) {
      pagePicker = (
        <ListPicker
          items={pagePickerItems}
          onItemPress={(itemKey) => {this._pagePickerValueChanged(itemKey, itemKey)}} />
      )
    }
    return pagePicker;
  }

  _pagePickerButtonPressed = () => {
    console.log("in _pagePickerButtonPressed");
    this._setModalVisible(!(this.state.pagePickerVisible));
  }

  _pagePickerDismissed() {
    console.log("in _pagePickerDismissed");
    this._setModalVisible(!this.state.pagePickerVisible);
  }

  /**
  * @param itemValue {string}
  * @param itemIndex {number}
  */
  _pagePickerValueChanged(itemValue, itemIndex) {
    console.log("in _pagePickerValueChanged");
    console.log("    old current page: " + this.state.currentPage.toString());
    console.log("    page selected: " + itemValue.toString());
    this._setModalVisible(!this.state.pagePickerVisible);
    let maxResultsPerRequest = 10;
    let start = (itemValue - 1) * maxResultsPerRequest;
    console.log("    start (converted from page selected): " + start.toString());
    this._submitQuery(this.state.lastSearch, start);
    this.setState({currentPage: itemValue});
  }

  /**
  * Computes the number of pages given the number of results of an OEIS request.
  * @param numberOfHits {number}
  */
  _computeNumberOfPages(numberOfHits) {
    console.log("in _computeNumberOfPages");
    let maxResultsPerRequest = 10;
    let numberOfPages = Math.ceil((0.0 + numberOfHits) / maxResultsPerRequest);
    if (numberOfPages < 1) {
      numberOfPages = 1;
    }
    console.log("    number of pages: " + numberOfPages.toString());
    return numberOfPages;
  }

  /**
  * Computes the current page from the given start.
  * @param {number} start - the start
  * @param {number} resultsPerPage - the number of results per page
  * @return {number} - the current page
  */
  _computeCurrentPage(start, resultsPerPage) {
    console.log("in _computeCurrentPage");
    console.log("    start: " + start.toString());
    console.log("    resultsPerPage: " + resultsPerPage.toString());
    console.log("    current page (start/resultsPerPage + 1): " + ((start / resultsPerPage) + 1).toString());
    return (start / resultsPerPage) + 1;
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    // padding: 10
  },
  pronouncedBorder: {
    borderColor: "#bbb",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
  },
  /** Don't forget to use pronounced border with this style! */
  boldTextInput: {
    fontSize: 18,
    height: 40,
    backgroundColor: "white",
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  minorText: {
    fontSize: 15,
    color: "#666",
  },
  noResultsView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    color: "#666",
    textAlign: "center",
  },
});
