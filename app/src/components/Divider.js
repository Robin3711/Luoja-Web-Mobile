import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getPlatformStyle } from '../utils/utils';

styles = getPlatformStyle();

const VerticalDivider = () => {
  return <View style={styles.divider} />;
};

export default VerticalDivider;
