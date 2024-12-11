import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const platform = Platform.OS;

const Star = ({ color }) => (
    <Svg width={platform === 'web' ? "115" : "75"} height="115" viewBox="-2 -2 28 28" fill="none">
        <Path
            d="M12 .587l3.668 7.429L24 9.433l-6 5.843 1.42 8.294L12 19.771l-7.42 3.799L6 15.276 0 9.433l8.332-1.417L12 .587z"
            stroke="#0c0d25"
            strokeWidth="1.5"
        />
        <Path
            d="M12 .587l3.668 7.429L24 9.433l-6 5.843 1.42 8.294L12 19.771l-7.42 3.799L6 15.276 0 9.433l8.332-1.417L12 .587z"
            stroke="#0c0d25"
            strokeWidth="1.5"
            fill={color || "#5c5c78"}
        />
    </Svg>
);

const Triangle = ({ color }) => (
    <Svg width={platform === 'web' ? "115" : "75"} height="115" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 22h20L12 2z" stroke="#283971" strokeWidth="1.5" />
        <Path d="M12 2L2 22h20L12 2z" stroke="#283971" strokeWidth="1.5" fill={color || "#96a9e4"} />
    </Svg>
);

const AnswerButton = ({ shape, onClick, text, filter }) => {
    const backgroundColors = {
        SQUARE: '#58bdfe',
        CIRCLE: '#484a77',
        TRIANGLE: '#4d65b4',
        STAR: '#323353',
    };

    const filters = {
        GREEN: 'rgba(65, 105, 225, 1)',
        BLUE: 'rgba(0, 0, 255, 1)',
        RED: 'rgba(240, 30, 80, 1)',
    };

    const renderShape = () => {
        const shapeColor = filters[filter];
        switch (shape) {
            case 'SQUARE':
                return <View style={[styles.shapeStyles.square, { backgroundColor: shapeColor || "#c0e6ff" }]} />;
            case 'CIRCLE':
                return <View style={[styles.shapeStyles.circle, { backgroundColor: shapeColor || "#7577af" }]} />;
            case 'TRIANGLE':
                return <Triangle color={shapeColor} />;
            case 'STAR':
                return <Star color={shapeColor} />;
            default:
                return null;
        }
    };

    return (
        <TouchableOpacity
            onPress={() => onClick(text)}
            style={[
                styles.container,
                { backgroundColor: backgroundColors[shape] || '#ffffff' },
            ]}
        >
            {renderShape()}
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: platform === 'web' ? 160 : 100,
        width: '95%',
        marginVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 25,
        position: 'relative',
        overflow: 'hidden',
        ...platform === 'web' ? {
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
        } : { elevation: 2 },
    },
    text: {
        width: '75%',
        textAlign: 'center',
        color: 'white',
        fontSize: 25,
    },
    shapeStyles: {
        square: {
            width: platform === 'web' ? 115 : 75,
            height: platform === 'web' ? 115 : 75,
            borderRadius: 10,
            borderWidth: platform === 'web' ? 7 : 5,
            borderColor: '#09649f',
        },
        circle: {
            width: platform === 'web' ? 115 : 75,
            height: platform === 'web' ? 115 : 75,
            borderRadius: platform === 'web' ? 70 : 45,
            borderWidth: platform === 'web' ? 7 : 5,
            borderColor: '#212248',
        },
    },
});

export default AnswerButton;
