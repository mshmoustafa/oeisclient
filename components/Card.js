import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';

/**
* @class Card {React.Component}
*
* @property key {number} An optional unique number that uniquely identifies this card. It is required if you will be putting the card in an array.
* @property header {string} A large, bold heading at the top of the card.
* @property subHeader {string} A subheading to display under the heading.
* @property body {string} The body text of the card.
*/
export default class Card extends React.Component {
    render() {
        let headerView;
        if (this.props.header !== undefined) {
            headerView = (
                <Text style={styles.cardHeader}>{this.props.header}</Text>
            );
        }
        let subHeaderView;
        if (this.props.subHeader !== undefined) {
            subHeaderView = (
                <Text style={styles.cardSubHeader}>{this.props.subHeader}</Text>
            );
        }
        let bodyView;
        if (this.props.body !== undefined) {
            let bodyStyle = [];
            // if (this.props.header !== undefined || this.props.subHeader !== undefined) {
                bodyStyle.push(styles.separator);
            // }
            bodyStyle.push(styles.cardBody);
            bodyView = (
                <View style={styles.separator}>
                    <Text style={styles.cardBody}>{this.props.body}</Text>
                </View>
            );
        }
        return (
            <View style={[styles.pronouncedBorder, {marginBottom: 10, marginHorizontal: 10,}]}>
                <TouchableHighlight
                    onPress={this.props.onPress}>
                    <View style={styles.card}>
                        <View
                            style={{backgroundColor: "white"}}>
                            {headerView}
                            {subHeaderView}
                            {bodyView}
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pronouncedBorder: {
        borderColor: "#bbb",
        borderWidth: 1,
        borderStyle: "solid",
        // borderRadius: 3,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        // shadowRadius: 1
        shadowRadius: 0
    },
    separator: {
        borderTopColor: "#eee",
        borderTopWidth: 1,
        borderStyle: "solid",
        paddingTop: 5,
    },
    /** Don't forget to use pronounced border with this style! */
    card: {
        padding: 15,
        backgroundColor: "white"
    },
    cardHeader: {
        fontSize: 22,
        fontWeight: "500",
        paddingBottom: 5
    },
    cardSubHeader: {
        fontSize: 21,
        paddingBottom: 5
    },
    cardBody: {
        fontSize: 18
    }
});
