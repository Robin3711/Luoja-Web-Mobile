import { Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;

export default function SimpleButton({
    text,
    onPress,
    color = COLORS.button.blue.basic,
    height = isMobile ? 50 : 75,
    width = isMobile ? 250 : 350,
    textStyle = {},
    disabled,
    marginVertical = 10,
    marginBottom = 25,
    paddingVertical = 10,
    loading = false,
    backgroundColor = COLORS.button.blue.basic,
}) {
    const [scale, setScale] = useState(1);
    const [buttonColor, setButtonColor] = useState(color);

    const handleMouseEnter = () => {
        // Scale up the button and darken the color on mouse enter
        setScale(1.1);
        setButtonColor(darkenColor(color));
    };

    const handleMouseLeave = () => {
        // Return to original size and color on mouse leave
        setScale(1);
        setButtonColor(color);
    };

    const darkenColor = (color) => {
        // Simple function to darken the color by adjusting its brightness
        let hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Darken the color by reducing the brightness
        r = Math.max(0, r - 15);
        g = Math.max(0, g - 15);
        b = Math.max(0, b);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                {
                    backgroundColor: buttonColor,
                    minHeight: height,
                    width: width,
                    marginVertical,
                    marginBottom,
                    paddingVertical,
                    transform: [{ scale: !isMobile ? scale : 1 }],
                    backgroundColor: disabled ? COLORS.button.disabled : backgroundColor
                },
            ]}
            disabled={disabled}
            onMouseEnter={handleMouseEnter}  // For web
            onMouseLeave={handleMouseLeave}  // For web
        >
            <View style={styles.elements} >
                <Text style={[FONT.button, styles.buttonText, textStyle]}>{text}</Text>
                {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginLeft: 10 }} />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'relative',
        borderRadius: 15,
        justifyContent: 'center', // Centre the content vertically
        alignItems: 'center',    // Centre the content horizontally
        ...!isMobile
            ? {
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
            }
            : {
                elevation: 2, // Shadows for Android
                shadowColor: '#000', // Shadows for iOS
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.25,
                shadowRadius: 1,
            },
    },
    buttonText: {
        textAlign: 'center',
        flexWrap: 'wrap', // Allows text to wrap if needed
    },
    elements: {
        display: 'flex',
        flexDirection: 'row',

    }
});
