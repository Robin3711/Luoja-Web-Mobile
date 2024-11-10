import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const RangeCursor = () => {
  const [value, setValue] = useState(1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sélection : {value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={50}
        step={1}
        value={value}
        onValueChange={(sliderValue) => setValue(sliderValue)}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1EB1FC"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    width: 300,
    height: 40,
  },
});

export default RangeCursor;
