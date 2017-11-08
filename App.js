import Beacons  from 'react-native-beacons-manager';
import React, {Component} from 'react';
import {
  View,
  ListView,
  Text,
  DeviceEventEmitter,
  StyleSheet,
  Image
} from 'react-native';


export default class beaconRangingOnly extends Component {
  // will be set as a reference to "beaconsDidRange" event:
  beaconsDidRangeEvent = null;

  state = {

    uuids: [
      '6bf064a9-6471-fc9e-f0e3-7af844bd3e38',
      '7b44b47b-52a1-5381-90c2-f09b6838c5d4',
    ],

    regions: [
      { uuid: '6bf064a9-6471-fc9e-f0e3-7af844bd3e38', identifier: 'id0' },
      { uuid: '7b44b47b-52a1-5381-90c2-f09b6838c5d4', identifier: 'id1' },
    ],

    beacons: [
      {name: 'clue1', description: 'some description1', distance: -1, minor: 1, uuid: '7b44b47b-52a1-5381-90c2-f09b6838c5d4'},
      {name: 'clue2', description: 'some description2', distance: -1, minor: 2, uuid: '7b44b47b-52a1-5381-90c2-f09b6838c5d4'},
      {name: 'clue3', description: 'some description3', distance: -1, minor: 3, uuid: '6bf064a9-6471-fc9e-f0e3-7af844bd3e38'},
      {name: 'clue4', description: 'some description4', distance: -1, minor: 4, uuid: '6bf064a9-6471-fc9e-f0e3-7af844bd3e38'},
    ],
  };

  componentWillMount(){
    //
    // ONLY non component state aware here in componentWillMount
    //

    // start iBeacon detection (later will add Eddystone and Nordic Semiconductor beacons)
    Beacons.detectIBeacons();
    // Range beacons inside the region
    // 6bf064a9-6471-fc9e-f0e3-7af844bd3e38
    Beacons
      .startRangingBeaconsInRegion(this.state.regions[1]) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
      .then(() => console.log('Beacons ranging started succesfully'))
      .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

    Beacons
      // .startRangingBeaconsInRegion(this.state.regions[0]) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
      // .then(() => console.log('Beacons ranging started succesfully'))
      // .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

    // Beacons
    //   .startRangingBeaconsInRegion({
    //     uuid: '6bf064a9-6471-fc9e-f0e3-7af844bd3e38',
    //     identifier: 'id2'
    //   }) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
    //   .then(() => console.log('Beacons ranging started succesfully'))
    //   .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

    // Beacons
    //   .startRangingBeaconsInRegion({
    //     uuid: '6bf064a9-6471-fc9e-f0e3-7af844bd3e38',
    //     identifier: this.state.identifier
    //   })
  }

  componentDidMount() {
    this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        //console.log('beaconsDidRange data: ', data);
        // console.log(data)
        const {beacons} = this.state;
        const {uuid} = data;
        const items = data.beacons;

        const measured = beacons.map(beacon => {
          const item = items.find(item => item.minor === beacon.minor);

          if(!item)
            return {
              ...beacon,
              distance: -1,
            };

          return {
            ...beacon,
            distance: item.distance,
          }
        });

        const sorted = measured.slice().sort((b1, b2) => {
          if(b2.distance != -1 || b1.distance != -1) {
            return b2.distance - b1.distance;
          } else {
            return b1.name.localeCompare(b2.name);
          }
        });
        console.log(sorted)

        this.setState({beacons: sorted}, () => console.log(this.state.beacons))
      }
    );
  }

  componentWillUnMount() {
    this.beaconsDidRangeEvent.remove();
  }

  render() {
    const { beacons } =  this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.headline}>
          ranging beacons in the area:
        </Text>

        <View style={styles.rowsWrapper}>
          {beacons.map((beacon, i) =>
            !i
              ? this.renderFirstRangingRow(beacon.name, beacon.distance)
              : this.renderRangingRow(beacon.name, beacon.distance))}
        </View>
      </View>
    );
  }

  renderRangingRow = (name, distance) => {
    return (
      <View style={styles.row}>
        <Text style={styles.name}>{ name }</Text>
        <Text>{ distance }</Text>
      </View>
    );
  };

  renderFirstRangingRow = (name, distance) => {
    return (
      <View style={styles.firstRowWrapper}>
        <View style={styles.firstRow}>
          <Text style={styles.name}>{ name }</Text>
          <Text>{ distance }</Text>
        </View>
        <View style={styles.firstBadge}>
          <Text style={styles.currentlyWithinRange}>CURRENTLY WITHIN RANGE!</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    margin: 10,
    padding: 30,
    backgroundColor: '#173166',
    borderRadius: 30,
  },

  firstRow: {
    padding: 30,
    backgroundColor: '#173166',
    borderRadius: 30,
    borderColor: '#eb627e',
    borderWidth: 5,
    width: '100%',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eb627e'
  },

  rowsWrapper: {
    backgroundColor: '#fff',
    width: '100%',
    paddingTop: 40
  },

  firstBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#eb627e',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },

  currentlyWithinRange: {
    color: '#fff',
    fontWeight: 'bold',
  },

  firstRowWrapper: {
    position: 'relative',
    margin: 10,
    alignItems: 'center'
  },
});