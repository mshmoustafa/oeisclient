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
import Colors from '../constants/Colors.js';
import Styles from '../constants/Styles.js';
import a from '../components/a';

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
    // pagePickerVisible: false,
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
    let pagePicker = this._pagePicker();
    let modal1 = (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.activityIndicatorVisible}>
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
    // let modal2 = (
    //   <Modal
    //     animationType="fade"
    //     transparent={true}
    //     visible={this.state.pagePickerVisible}
    //     >
    //     <View style={{
    //         flex: 1,
    //         flexDirection: 'column',
    //         justifyContent: 'flex-end',
    //         alignItems: 'stretch',
    //         backgroundColor: 'rgba(0, 0, 0, 0.2)',
    //       }}>
    //       <View style={{backgroundColor: "white"}}>
    //         <Button
    //           title="Done"
    //           onPress={() => {this._pagePickerDismissed();}} />
    //         {pagePicker}
    //       </View>
    //     </View>
    //   </Modal>
    // );
    // return (
    //   <View style={styles.base}>
    //     {modal1}
    //     {modal2}
    //     <View style={{flex: 1}}>
    //       {body}
    //     </View>
    //   </View>
    // );
    return (
      <View style={styles.base}>
        {modal1}
        <View style={{flex: 1}}>
          {body}
        </View>
      </View>
    );
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
    let _oeis = new OEIS("english", false);
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

  _searchHeader = () => {
    return (
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
          onSubmitEditing={() => this._submitQuery(this.state.text, 0)}/>
      </View>
    );
  }

  _searchFooter = (numberOfHits) => {
    let numberOfPages = this._computeNumberOfPages(numberOfHits);
    let pagePickerString = "Page " + this.state.currentPage + " of " + numberOfPages;
    return (
      <View>
        <Button
          title={pagePickerString}
          onPress={this._pagePickerButtonPressed}/>
        <FlatList
          /* contentContainerStyle={{flex: 1, justifyContent: "center"}} */
          style={{marginBottom: 10}}
          centerContent={true}
          data={Array.from(Array(numberOfPages).keys())}
          renderItem={({item}) => <Button key={(item+1).toString()} title={" " + (item+1).toString() + " "} />}
          horizontal={true}
          keyExtractor={(item) => (item+1).toString() } />
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
        headerComponent={this._searchHeader}
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
    if (searchResults === undefined || searchResults === null) {
      console.log("    No search results!");
      Alert.alert("No Results", "Your search returned no results.");
      return;
    }
    let list = (
      <FlatList
        data={searchResults}
        renderItem={this._searchResultCard}
        ItemSeparatorComponent={() => <ListCellSeparator />}
        ListHeaderComponent={this._searchHeader}
        ListFooterComponent={this._searchFooter(numberOfHits)}
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
      pagePickerItems.push(
        <Picker.Item key={i} label={i.toString()} value={i}/>
      );
    }
    let pagePicker;
    if (this.state.pagePickerVisible === true) {
      pagePicker = <Picker
        selectedValue={this.state.currentPage}
        style={{
          height: 225,
        }}
        onValueChange={(/** @type {number} */ itemValue, /** @type {number} */ itemIndex) => this._pagePickerValueChanged(itemValue, itemIndex)}>
        {pagePickerItems}
      </Picker>
    }
    return pagePicker;
  }

  _pagePickerDismissed() {
    console.log("in _pagePickerDismissed");
    console.log("    page selected: " + this.state.currentPage.toString());
    this._setModalVisible(!this.state.pagePickerVisible);
    let maxResultsPerRequest = 10;
    let start = (this.state.currentPage - 1) * maxResultsPerRequest;
    console.log("    start (converted from page selected): " + start.toString());
    this._submitQuery(this.state.lastSearch, start);
  }

  /**
  * @param itemValue {string}
  * @param itemIndex {number}
  */
  _pagePickerValueChanged(itemValue, itemIndex) {
    console.warn("in _pagePickerValueChanged");
    console.log("    old current page: " + this.state.currentPage.toString());
    console.log("    page selected: " + itemValue.toString());
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
  /** This is meant to be applied to a button's container to make it look more pronounced. */
  /** Don't forget to use pronounced border with this style! */
  callToActionButtonContainer: {
    backgroundColor: Colors.tintColor,
    borderColor: Colors.darkerTintColor,
    shadowColor: Colors.darkestTintColor,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    margin: 10,
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
  }
});
