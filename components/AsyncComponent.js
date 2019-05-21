import React from 'react';
import {View, ActivityIndicator} from 'react-native';

class AsyncComponent extends React.PureComponent {

  state = {
    asyncComponent: undefined,
  }

  render() {
    this._renderAsyncComponent();
    return (
      <View>
        {this.state.asyncComponent ? this.state.asyncComponent : <ActivityIndicator />}
      </View>
    );
  }

  _renderAsyncComponent = function() {
    setTimeout(() => {
      let asyncComponent = this.props.asyncComponent(this.props.arguments);
      setTimeout(() => this.setState({asyncComponent: asyncComponent}), 100);
    }, 5000);
  }
};

export { AsyncComponent };
