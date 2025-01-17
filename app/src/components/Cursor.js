import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-assets/slider';
import { FONT } from '../css/utils/font';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;

const RangeCursor = ({ value, onValueChange }) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleValueChange = (value) => {
    setSliderValue(value);
    onValueChange(value);
  };

  return (
    <View style={styles.cursorContainer}>
      <Text style={FONT.text}>Nombre de questions choisies : {sliderValue} / 50</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={50}
        step={1}
        value={sliderValue}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1EB1FC"
      />
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
    fontSize: !isMobile ? 20 : 18,
    fontWeight: 'bold',
    margin: 10,
  },
  slider: {
    width: !isMobile ? 700 : 300,
    height: 40,
  },
});

export default RangeCursor;
