import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableWithoutFeedback
} from 'react-native';

import SlidingUpPanel from './SlidingUpPanel';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  togglePanel = () => this.toggle(-100);

  render() {
    const panelHeader = (
      <View style={{padding: 20}} >
        <TouchableWithoutFeedback title={'test'} onPressIn={() => console.log('click')}>
          <Text>handle</Text>
        </TouchableWithoutFeedback>
        {this.props.handle}
      </View>
    );

    return (
      <View style={styles.container}>
        <Text>some text</Text>
        <SlidingUpPanel
          maxTop={400}
          maxBottom={0}
          heightOffset={80}
          containerStyle={{
            width: '100%',
            backgroundColor: '#fff',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            height: '100%',
          }}
          setAnimationCallack={toggle => this.toggle = toggle}
          handle={panelHeader}>
          <Text>some text</Text>
          <Button title="toggle" onPress={this.togglePanel}/>
        </SlidingUpPanel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc'
  },
});
