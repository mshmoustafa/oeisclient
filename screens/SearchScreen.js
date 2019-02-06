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
    ActivityIndicator,
} from 'react-native';
import {OEIS, OEISResponse, OEISSequence} from "../lib/oeis";
import Utility from '../lib/Utility';
import Card from '../components/Card';
// import {Picker, PickerOptions} from 'react-native-picker';

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
        let body;
        if (this.state.searchResults === undefined) {
            body = this._introView();
        } else {
            body = this._searchResultsListView(this.state.searchResults.results, this.state.searchResults.count);
        }
        let pagePicker = this._pagePicker();
        return (
            <View
                style={{
                    flex: 1
                }}>
                <ScrollView
                    style={styles.base}>
                    <TextInput
                        style={[styles.pronouncedBorder, styles.boldTextInput]}
                        placeholder="Search the OEIS..."
                        onChangeText={(text) => this.setState(previousState => {
                            this.state.text = text;
                        })}
                        onSubmitEditing={() => this._submitQuery(this.state.text, 0)}/>
                    <View style={[styles.pronouncedBorder, styles.callToActionButtonContainer]}>
                        <Button
                            title="Search"
                            onPress={this._searchButtonPressed}/>
                    </View>
                    <View style={{
                            marginTop: 10
                        }}>
                        {body}
                    </View>
                </ScrollView>
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.pagePickerVisible}
                    >
                    <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            alignItems: 'stretch',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        }}>
                        <View style={{backgroundColor: "white"}}>
                            <Button
                                title="Done"
                                onPress={() => {this._pagePickerDismissed();}} />
                            {pagePicker}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    _setModalVisible(visible) {
        console.log("in _setModalVisible");
        this.setState({pagePickerVisible: visible});
    }

    _searchButtonPressed = () => {
        console.log("in _searchButtonPressed");
        console.log("    Search Button Tapped");
        this._submitQuery(this.state.text, 0);
    }

    _pagePickerButtonPressed = () => {
        console.log("in _pagePickerButtonPressed");
        this.setState(previousState => ({pagePickerVisible: true}));
        // let thePicker = <Picker     style={{         height: 300     }}
        // showDuration={300}     showMask={true}     pickerData={["Java,
        // JavaScript"]}//picker`s value List     selectedValue={"Java"}//default to be
        // selected value     // onPickerDone={}//when confirm your choice />
        // let thePickerOptions = {
        //     pickerData: ["Java, JavaScript"],
        //     selectedValue: ["Java"]
        // }
        // let thePicker = new Picker(thePickerOptions)
        // thePicker.toggle();
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
            // this._parseResults(results);
            // TODO: hide the progress bar
            // this.setState(previousState => ({activityIndicatorVisible: false}));
        });

    }

    _introView = () => {
        console.log("in _introView");
        console.log("    making the intro view...");
        let key = 0;
        let listViewContents = [
            {
                header: "Welcome to OEIS Client!",
                body: "It's awesome!"
            }
        ];
        let listView = new Array();
        listViewContents.forEach(element => {
            // listView.push(this._cardView(key, element.header, element.body));
            listView.push(<Card key={key} header={element.header} body={element.body}/>);
            key = key + 1;
        });
        return (
            <View>
                {listView}
            </View>
        );
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
        let listView = new Array();
        searchResults.forEach(element => {
            listView.push(this._searchResultCard(element));
        });
        let pagePickerString = "Page " + this.state.currentPage + " of " + this._computeNumberOfPages(numberOfHits);
        return (
            <View>
                <Text
                    style={[styles.minorText, {textAlign: "left", marginBottom: 18}]}>
                    Retrieved {this.state.searchResults.count} results.
                </Text>
                {listView}
                <Button
                    title={pagePickerString}
                    onPress={this._pagePickerButtonPressed}/>
                <View style={{
                        height: 50
                    }}>
                </View>
            </View>
        );
    }

    /**
    * @param oneSearchResult {OEISSequence}
    */
    _searchResultCard = (oneSearchResult) => {
        let sequenceNumber = Utility.prettifyNumber(oneSearchResult.number);
        let dataWithSpaces = Utility.addSpacesBetweenCommas(oneSearchResult.data);
        return (
            <Card
                key={oneSearchResult.number}
                header={sequenceNumber}
                subHeader={oneSearchResult.name}
                body={dataWithSpaces} />
        );
    }

    _pagePicker = () => {
        console.log("in _pagePicker");
        console.log("    making the page picker...");
        if (this.state.searchResults === undefined || this.state.searchResults === null) {
            return undefined;
        }
        let numberOfPages = this._computeNumberOfPages(this.state.searchResults.count);
        // let currentPage = this._computeCurrentPage(this.state.searchResults.start, 10);
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
        console.log("in _pagePickerValueChanged");
        console.log("    old current page: " + this.state.currentPage.toString());
        console.log("    page selected: " + itemValue.toString());
        this.setState({currentPage: itemValue});
    }

    /**
    * Computes the number of pages given the number of results of an OEIS request.
    * @param numberOfHits {number}
    */
    _computeNumberOfPages(numberOfHits) {
        console.log("in computNumberOfPages");
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
        backgroundColor: "#fdfdfd",
        padding: 10
    },
    pronouncedBorder: {
        borderColor: "#ddd",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 3,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1
    },
    /** This is meant to be applied to a button's container to make it look more pronounced. */
    /** Don't forget to use pronounced border with this style! */
    callToActionButtonContainer: {
        backgroundColor: "white",
        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        marginTop: 10,
        marginBottom: 10
    },
    /** Don't forget to use pronounced border with this style! */
    boldTextInput: {
        fontSize: 18,
        height: 40,
        backgroundColor: "white",
        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    minorText: {
        fontSize: 15,
        color: "#666",
    }
});
