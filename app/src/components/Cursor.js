import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const RangeCursor = ({ value, onValueChange }) => {
  return (
    <View >
      <Text>Sélection : {value}</Text>
      <Slider
        minimumValue={1}
        maximumValue={50}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1EB1FC"
      />
    </View>
  );
};



export default RangeCursor;
