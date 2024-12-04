import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const platform = Platform.OS;

const RangeCursor = ({ testID, value, onValueChange }) => {

  const handleValueChange = (values) => {
    const newValue = values[0];
    onValueChange(newValue);
  };

  return (
    <View style={styles.cursorContainer}>
      <Text style={styles.cursorLabel}>Sélection : {value}</Text>
      <View style={styles.cursorSliderView}>
        <MultiSlider
          values={[value]}
          min={1}
          max={50}
          step={1}
          onValuesChange={handleValueChange}
          selectedStyle={{ backgroundColor: '#1EB1FC' }}
          unselectedStyle={{ backgroundColor: '#d3d3d3' }}
          trackStyle={styles.trackStyle}
          markerStyle={styles.markerStyle}
          sliderLength={800}
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
    margin: 10,
  },
  cursorSliderView: {
    width: '100%',
    alignItems: 'center',
  },
  trackStyle: {
    height: 4,
  },
  markerStyle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#1EB1FC', // Couleur du curseur
  },
});

export default RangeCursor;
