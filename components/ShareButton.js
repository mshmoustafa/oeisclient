import React, {Component} from 'react';
import {Share, Button} from 'react-native';
export default class MyShareButton extends Component {
  onShare = () => {
    Share.share({
      title: this.props.shareTitle,
      url: this.props.url,
      message: this.props.url,
    }).then(function(result) {
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("shared but I don't know what this means");
        } else {
          // shared
          console.log("shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("share dismissed");
      }
    }).catch(function(error) {
      alert(error.message);
    });
  };

  render() {
    return (
      <Button title={this.props.title} onPress={this.onShare} />
      // <Button title="Open" />
    );
  }

}
