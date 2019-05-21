import React from 'react';
import { View, Text } from 'react-native';

// export default function(href, text) {
//   return (
//       <Text
//         onPress={() => {console.warn("hi")}}
//         style={{color: "blue"}}>
//         {text}
//       </Text>
//   );
// }

// export default class a extends React.Component {
//   render() {
//     console.error(this.props.children);
//     return <Text>{this.props.children}</Text>
//   }
// }

export default class a extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Text>
      {this.props.children}
    </Text>
    )
  }
}
