import { Navigation } from 'react-native-navigation';
import {View, Text, Button} from 'react-native';

const FirstTabScreen = () => (
  <View>
    <Text>FirstTabScreen</Text>
    <Button title={'go to SecondTabScreen'}/>
  </View>
);

const SecondTabScreen = () => (
  <View>
    <Text>SecondTabScreen</Text>
    <Button title={'go to FirstTabScreen'}/>
  </View>
);

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('example.FirstTabScreen', () => FirstTabScreen);
  Navigation.registerComponent('example.SecondTabScreen', () => SecondTabScreen);
}