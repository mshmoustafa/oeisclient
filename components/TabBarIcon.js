import React from 'react';
// import { Icon } from 'expo';
import {
  Image,
  StyleSheet,
  Platform,
} from 'react-native';

import Colors from '../constants/Colors';

const icons = {
  iosSearch           : require("../assets/images/ios-search.png"),
  iosSearchSelected   : require("../assets/images/ios-search-selected.png"),
  iosSettings         : require("../assets/images/ios-cog.png"),
  iosSettingsSelected : require("../assets/images/ios-cog-selected.png"),
  iosHelp             : require("../assets/images/ios-help.png"),
  iosHelpSelected     : require("../assets/images/ios-help-selected.png"),
  mdSearch            : require("../assets/images/md-search.png"),
  mdSearchSelected    : require("../assets/images/md-search-selected.png"),
  mdSettings          : require("../assets/images/md-cog.png"),
  mdSettingsSelected  : require("../assets/images/md-cog-selected.png"),
  mdHelp              : require("../assets/images/md-help.png"),
  mdHelpSelected      : require("../assets/images/md-help-selected.png"),
};

export default class TabBarIcon extends React.Component {
  render() {

    let assetName = "";

    if (Platform.OS === "ios") {
      assetName = assetName + "ios";
    } else {
      assetName = assetName + "md";
    }

    if (this.props.name === "search") {
      assetName = assetName + "Search";
    } else if (this.props.name === "settings") {
      assetName = assetName + "Settings";
    } else if (this.props.name === "help") {
      assetName = assetName + "Help";
    }

    if (this.props.focused) {
      assetName = assetName + "Selected";
    }

    let asset = icons[assetName];

    return (
      <Image
      style={styles.icon}
      source={asset} />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  }
})
