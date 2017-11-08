import {
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Button,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';

import React, {Component} from 'react';

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    position: 'absolute',
  }
});

class SlidingUpPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posY: new Animated.Value(this.props.maxBottom),
    };

    this.valueY = this.props.maxBottom;
    this.state.posY.addListener((value) => this.valueY = value.value);

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => gestureState.dx != 0 && gestureState.dy != 0,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => gestureState.dx != 0 && gestureState.dy != 0,

      onPanResponderGrant: (e, gestureState) => {
        this.state.posY.setOffset(this.valueY);
        this.state.posY.setValue(0);
      },

      onPanResponderMove: (evt, gestureState) =>
        evt.nativeEvent.pageY > screenHeight - this.props.maxTop
        && Animated.event([null, { dy: this.state.posY }])(evt, gestureState),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.state.posY.flattenOffset();
        console.log(evt.nativeEvent.pageY)

        const middleLine = (this.props.maxTop);

        if(evt.nativeEvent.pageY < middleLine)
          this.animatePanel(-this.props.maxTop);
        else
          this.animatePanel(-this.props.maxBottom);

      },
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  componentDidMount() {
    this.props.setAnimationCallack(this.animatePanel);
  }

  animatePanel = toValue =>
    Animated.timing(
      this.state.posY,
      {
        toValue,
        duration: 200,
      }
    ).start();

  render() {
    const transitionStyle = {
      transform: [{
        translateY: this.state.posY
      }]
    };

    const { children, handle, containerStyle } = this.props;

    return (
      <Animated.View style={[
        transitionStyle,
        styles.mainContainer, (containerStyle || {}),
        {
          top: Dimensions.get('window').height - this.props.heightOffset,
        }
      ]}>
        <Animated.View {...this._panResponder.panHandlers}>
          {handle}
        </Animated.View>

        <View>
          {children}
        </View>
      </Animated.View>
    );
  }
}

export default SlidingUpPanel;
