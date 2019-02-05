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
} from 'react-native';
import OEIS from "../lib/oeis";
import Utility from '../lib/Utility';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Search",
  };
  
  state = {
    text: "",
    lastSearch: "",
    currentStart: 0,
    searchResults: undefined,
    pageSelectorVisible: false,
  }
  
  render() {
    let body;
    if (this.state.searchResults === undefined) {
      body = this._introView();
    } else {
      body = this._searchResultsListView(this.state.searchResults.results);
    }
    return (
      <ScrollView
        style={styles.base}>
        <TextInput
          style={[styles.pronouncedBorder, styles.boldTextInput]}
          placeholder="Search the OEIS..."
          onChangeText={(text) => this.setState(previousState => {
            this.state.text = text;
          })}
          onSubmitEditing={() => this._submitQuery(this.state.text)}
        />
        <View style={[styles.pronouncedBorder, styles.callToActionButtonContainer]}>
          <Button
            title="Search"
            onPress={this._searchButtonPressed}
          />
        </View>
        <View style={{marginTop: 10}}>
          {body}
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.pageSelectorVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <Picker
            selectedValue={"java"}
            style={{height: 50, width: 100}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({language: itemValue})
            }>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>
        </Modal>
      </ScrollView>
      );
    }
    
    _searchButtonPressed = () => {
      console.info("Search Button Tapped");
      this._submitQuery(this.state.text);
    }
    
    _pageSelectorButtonPressed = () => {
      this.setState({
        text: previousState.text,
        lastSearch: previousState.lastSearch,
        currentStart: previousState.currentStart,
        searchResults: previousState.searchResults,
        modalVisible: true,
      });
    }
    
    /**
    * Validates search query from the search bar and performs a search.
    * @param text {string}
    * @param start {number}
    */
    _submitQuery = (text, start) => {
      console.log("Search query: " + text);
      if (text.trim() === "") {
        console.log("Search query was empty, doing nothing");
        return;
      }
      // TODO: show a progress bar
      defaultOEIS.searchByQuery(text, "json", (results) => {
        console.log(results.greeting);
        console.log("Retrieved " + results.count + " results.");
        this.setState(previousState => (
          {
            text: previousState.text,
            lastSearch: text,
            currentStart: previousState.currentStart,
            searchResults: results,
            modalVisible: previousState.pageSelectorVisible,
          }
          ));
          // this._parseResults(results);
          // TODO: hide the progress bar
        })
      }
      
      _introView = () => {
        let key = 0;
        let listViewContents = [
          {
            header: "Welcome to OEIS Client!",
            body: "It's awesome!",
          },
        ];
        let listView = new Array();
        listViewContents.forEach(element => {
          listView.push(this._cardView(key, element.header, element.body));
          key = key + 1;
        });
        return (
          <View>
          {listView}
          </View>
          );
        }
        
        _searchResultsListView = (searchResults) => {
          let listView = new Array();
          searchResults.forEach(element => {
            listView.push(this._searchResultCard(element));
          });
          let pageSelectorString = "Page " + this.state.currentStart + " of ???";
          return (
            <View>
            <Text>Retrieved {this.state.searchResults.count} results.</Text>
            {listView}
            <Button
            title={pageSelectorString}
            onPress={this._pageSelectorButtonPressed}
            />
            <View style={{height: 50}}></View>
            </View>
            );
          }
          
          _searchResultCard = (oneSearchResult) => {
            let sequenceNumber = Utility.prettifyNumber(oneSearchResult.number);
            let dataWithSpaces = Utility.addSpacesBetweenCommas(oneSearchResult.data);
            return this._cardView(
              oneSearchResult.number,
              sequenceNumber,
              oneSearchResult.name,
              dataWithSpaces);
            }
            
            /**
            * @param key {number}
            * @param header {string}
            * @param subHeader {string}
            * @param body {string}
            */
            _cardView = (key, header, subHeader, body) => {
              let headerView;
              if (header !== undefined) {
                headerView = (<Text style={styles.cardHeader}>{header}</Text>);
              }
              let subHeaderView;
              if (subHeader !== undefined) {
                subHeaderView = (<Text style={styles.cardSubHeader}>{subHeader}</Text>);
              }
              let bodyView;
              if (body !== undefined) {
                bodyView = (<Text style={styles.cardBody}>{body}</Text>);
              }
              return (
                <View key={key} style={[styles.pronouncedBorder, styles.card]}>
                {headerView}
                {subHeaderView}
                {bodyView}
                </View>
                );
              }
              
              /**
              * @param itemValue {string}
              * @param itemIndex {number}
              */
              pageSelectorOnchange(itemValue, itemIndex) {
                let maxResultsPerRequest = 10;
                let start = itemIndex * maxResultsPerRequest;
                this._submitQuery(this.state.lastSearch, start);
              }
              
              /**
              * Computes the number of pages given the number of results of an OEIS request.
              * @param numberOfHits {number}
              */
              computeNumberOfPages(numberOfHits) {
                let maxResultsPerRequest = 10;
                let numberOfPages = numberOfHits / maxResultsPerRequest;
                if (numberOfPages < 1) { numberOfPages = 1; }
                return numberOfPages;
              }
              
              /**
              * Computes the current page from the given start.
              * @param {number} start - the start
              * @param {number} resultsPerPage - the number of results per page
              * @return {number} - the current page
              */
              computeCurrentPage(start, resultsPerPage) {
                return start / resultsPerPage + 1;
              }
            }
            
            const styles = StyleSheet.create({
              base: {
                backgroundColor: "#fdfdfd",
                padding: 10,
              },
              pronouncedBorder: {
                borderColor: "#ddd",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 3,
                shadowColor: "black",
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 1,
              },
              /** This is meant to be applied to a button's container to make it look more pronounced. */
              /** Don't forget to use pronounced border with this style! */
              callToActionButtonContainer: {
                backgroundColor: "white",
                shadowColor: "#ccc",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 1,
                shadowRadius: 0,
                marginTop: 10,
                marginBottom: 10,
              },
              /** Don't forget to use pronounced border with this style! */
              boldTextInput: {
                fontSize: 18,
                height: 40,
                backgroundColor: "white",
                shadowColor: "#ccc",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 1,
                shadowRadius: 0,
                marginTop: 10,
                marginBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
              },
              /** Don't forget to use pronounced border with this style! */
              card: {
                padding: 15,
                marginBottom: 10,
                backgroundColor: "white",
              },
              cardHeader: {
                fontSize: 25,
                fontWeight: "bold",
                paddingBottom: 5,
              },
              cardSubHeader: {
                fontSize: 21,
                paddingBottom: 5,
              },
              cardBody: {
                fontSize: 18
              },
            });