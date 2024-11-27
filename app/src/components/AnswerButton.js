import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const platform = Platform.OS;

const Star = () => (
    <Svg width="75" height="75" viewBox="-2 -2 28 28" fill="none">
        <Path
            d="M12 .587l3.668 7.429L24 9.433l-6 5.843 1.42 8.294L12 19.771l-7.42 3.799L6 15.276 0 9.433l8.332-1.417L12 .587z"
            stroke="#0c0d25"
            strokeWidth="3"
        />
        <Path
            d="M12 .587l3.668 7.429L24 9.433l-6 5.843 1.42 8.294L12 19.771l-7.42 3.799L6 15.276 0 9.433l8.332-1.417L12 .587z"
            fill="#5c5c78"
        />
    </Svg>
);

const Triangle = () => (
    <Svg width="75" height="75" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 22h20L12 2z" stroke="#283971" strokeWidth="3" />
        <Path d="M12 2L2 22h20L12 2z" fill="#96a9e4" />
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
        GREEN: 'rgba(0, 255, 0, 0.6)',
        BLUE: 'rgba(0, 0, 255, 0.6)',
        RED: 'rgba(255, 0, 0, 0.6)',
    };

    const renderShape = () => {
        switch (shape) {
            case 'SQUARE':
                return <View style={styles.shapeStyles.square} />;
            case 'CIRCLE':
                return <View style={styles.shapeStyles.circle} />;
            case 'TRIANGLE':
                return <Triangle />;
            case 'STAR':
                return <Star />;
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
            {filter && (
                <View
                    style={[
                        styles.filterOverlay,
                        { backgroundColor: filters[filter] },
                    ]}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: platform === 'web' ? 125 : 100,
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
    },
    shapeStyles: {
        square: {
            width: 75,
            height: 75,
            backgroundColor: '#c0e6ff',
            borderRadius: 10,
            borderWidth: 5,
            borderColor: '#09649f',
        },
        circle: {
            width: 75,
            height: 75,
            backgroundColor: '#7577af',
            borderRadius: 45,
            borderWidth: 5,
            borderColor: '#212248',
        },
    },
    filterOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default AnswerButton;
