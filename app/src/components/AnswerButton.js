import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../css/utils/color';
import { downloadImage } from '../utils/api';

const platform = Platform.OS;

const Star = ({ shapeColor, borderColor }) => (
    <Svg width={platform === 'web' ? "115" : "75"} height="115" viewBox="-2 -2 28 28" fill="none">
        <Path
            d="M12 .587l3.668 7.429L24 9.433l-6 5.843 1.42 8.294L12 19.771l-7.42 3.799L6 15.276 0 9.433l8.332-1.417L12 .587z"
            stroke={borderColor || "#0c0d25"}
            strokeWidth="1.5"
        />
        <Path
            d="M12 .587l3.668 7.429L24 9.433l-6 5.843 1.42 8.294L12 19.771l-7.42 3.799L6 15.276 0 9.433l8.332-1.417L12 .587z"
            stroke={borderColor || "#0c0d25"}
            strokeWidth="1.5"
            fill={shapeColor || "#5c5c78"}
        />
    </Svg>
);

const Triangle = ({ shapeColor, borderColor }) => (
    <Svg width={platform === 'web' ? "115" : "75"} height="115" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 22h20L12 2z" stroke={borderColor || "#283971"} strokeWidth="1.5" />
        <Path d="M12 2L2 22h20L12 2z" stroke={borderColor || "#283971"} strokeWidth="1.5" fill={shapeColor || "#96a9e4"} />
    </Svg>
);

const AnswerButton = ({ shape, onClick, text, filter, type}) => {
    const backgroundColors = {
        SQUARE: '#58bdfe',
        CIRCLE: '#484a77',
        TRIANGLE: '#4d65b4',
        STAR: '#323353',
    };

    const figureFilters = {
        GREEN: COLORS.button.response.correct.light,
        RED: COLORS.button.response.incorrect.light,
    };

    const borderFilters = {
        GREEN: COLORS.button.response.correct.dark,
        RED: COLORS.button.response.incorrect.dark,
    };

    const questionFilters = {
        GREEN: COLORS.button.response.correct.normal,
        RED: COLORS.button.response.incorrect.normal,
    }

    const renderShape = () => {
        const shapeColor = figureFilters[filter];
        const borderColor = borderFilters[filter];
        switch (shape) {
            case 'SQUARE':
                return <View style={[styles.shapeStyles.square, { backgroundColor: shapeColor || "#c0e6ff", borderColor: borderColor || "#09649f" }]} />;
            case 'CIRCLE':
                return <View style={[styles.shapeStyles.circle, { backgroundColor: shapeColor || "#7577af", borderColor: borderColor || "#212248" }]} />;
            case 'TRIANGLE':
                return <Triangle shapeColor={shapeColor} borderColor={borderColor} />;
            case 'STAR':
                return <Star shapeColor={shapeColor} borderColor={borderColor} />;
            default:
                return null;
        }
    };

    const [file, setFile] = useState(null);

    useEffect(() => {
        if(type === 'image' && text !== '') {
            downloadImage(text).then((file) => {
                const uri = URL.createObjectURL(file);
                setFile(uri);
            });
        }
    }, [text, type]);

    return (
        <TouchableOpacity
            onPress={() => onClick(text)}
            style={[
                styles.container,
                {
                    backgroundColor: questionFilters[filter] || backgroundColors[shape],
                    borderColor: 'black', borderWidth: filter === 'BLUE' ? 7 : 0,
                    height: platform === 'web' ? filter === 'BLUE' ? 150 : 160 : filter === 'BLUE' ? 90 : 100,
                    width: filter === 'BLUE' ? '90%' : '95%',
                    marginVertical: filter === 'BLUE' ? 10 : 5,
                },
            ]}
        >
            {renderShape()}
            {type ==="text" &&(
                 <Text style={styles.text}>{text}</Text>
            )}
            {type === "image" && (
                <Image
                    source={{ uri: file }}
                    style={styles.Image}
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
        },
        circle: {
            width: platform === 'web' ? 115 : 75,
            height: platform === 'web' ? 115 : 75,
            borderRadius: platform === 'web' ? 70 : 45,
            borderWidth: platform === 'web' ? 7 : 5,
        },
    },
    Image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
});

export default AnswerButton;
