import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './color';

export default function GradientBackground({ children, showLogo = false }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background.blue, COLORS.background.dark_blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      {showLogo && (
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/LogoLuojaRepete.png')}
            style={styles.image}
          />
        </View>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    tintColor: COLORS.palette.blue.light,
    opacity: 0.20 ,
  },
});