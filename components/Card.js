import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

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
            bodyView = (
                <Text style={styles.cardBody}>{this.props.body}</Text>
            );
        }
        return (
            <View style={[styles.pronouncedBorder, styles.card]}>
                {headerView}
                {subHeaderView}
                {bodyView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
    /** Don't forget to use pronounced border with this style! */
    card: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: "white"
    },
    cardHeader: {
        fontSize: 25,
        fontWeight: "bold",
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