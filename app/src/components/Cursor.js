import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';

const platform = Platform.OS;

const RangeCursor = ({ testID, value, onValueChange, onSlidingComplete }) => {

  return (
    <View style={styles.cursorContainer}>
      <Text style={styles.cursorLabel}>Sélection : {value}</Text>
      <View style={styles.cursorSliderView}>
        <Slider
          minimumValue={1}
          maximumValue={50}
          step={1}
          onValueChange={onValueChange}
          onSlidingComplete={onSlidingComplete}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1EB1FC"
          testID={testID}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cursorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  cursorLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cursorSliderView: {
    width: '100%',
  },
});

export default RangeCursor;
