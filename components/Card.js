import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight, TouchableNativeFeedback, Platform} from 'react-native';

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
            bodyStyle.push(styles.separator);
            bodyStyle.push(styles.cardBody);
            bodyView = (
                <View style={styles.separator}>
                    <Text style={styles.cardBody}>{this.props.body}</Text>
                </View>
            );
        }
        const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight

        return (
            <View style={[styles.pronouncedBorder, {marginBottom: 20, marginHorizontal: 20,}]}>
                <Touchable
                    onPress={this.props.onPress}>
                    <View style={styles.card}>
                        <View>
                            {headerView}
                            {subHeaderView}
                            {bodyView}
                        </View>
                    </View>
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pronouncedBorder: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 3,
    },
    separator: {
        borderTopColor: "#eee",
        borderTopWidth: 1,
        borderStyle: "solid",
        paddingTop: 5,
    },
    card: {
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
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
