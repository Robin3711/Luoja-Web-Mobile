import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const ConfettiPiece = ({ delay, color, onEnd }) => {
  const translateY = useSharedValue(-150);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(Math.random() * 360);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height + 100, {
        duration: 3000,
        easing: Easing.out(Easing.quad),
      }, () => {
        runOnJS(onEnd)();
      })
    );

    rotate.value = withDelay(
      delay,
      withTiming(rotate.value + 360, {
        duration: 3000,
        easing: Easing.linear,
      })
    );

    opacity.value = withDelay(
      delay + 2500,
      withTiming(0, {
        duration: 500,
        easing: Easing.linear,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.piece, animatedStyle]}>
      <Svg height="20" width="10">
        <Rect width="10" height="20" fill={color} />
      </Svg>
    </Animated.View>
  );
};

const ConfettiSystem = ({ count = 50, colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A8', '#33FFF6'], isActive }) => {
  const [activePieces, setActivePieces] = React.useState([]);

  const handleEnd = (index) => {
    setActivePieces((prev) => prev.filter((i) => i !== index));
  };

  useEffect(() => {
    if (isActive) {
      setActivePieces(Array.from({ length: count }, (_, index) => index));
    } else {
      setActivePieces([]);
    }
  }, [isActive]);

  return (
    <View style={styles.container} pointerEvents="none">
      {activePieces.map((index) => (
        <ConfettiPiece
          key={index}
          delay={Math.random() * 1000}
          color={colors[Math.floor(Math.random() * colors.length)]}
          onEnd={() => handleEnd(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  piece: {
    position: 'absolute',
  },
});

const ConfettiContainer = React.forwardRef((props, ref) => {
  const [isActive, setIsActive] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    startConfetti: () => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 5000); // Stop the confetti after 5 seconds
    },
  }));

  return <ConfettiSystem isActive={isActive} {...props} />;
});

export default ConfettiContainer;
