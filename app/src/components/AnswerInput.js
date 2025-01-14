import React, { useCallback, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ChooseFile from './Choosefile';
import ChooseAudio from './ChooseAudio';
import { COLORS } from '../css/utils/color';
import { useFocusEffect } from '@react-navigation/native';
import { downloadImage, downloadAudio } from '../utils/api';
import { hasExtension, hasValidAudioExtension, hasValidImageExtension } from '../utils/utils';

const Star = ({ shapeColor, borderColor }) => (
    <Svg width="75" height="75" viewBox="-2 -2 28 28" fill="none">
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
    <Svg width="75" height="75" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 22h20L12 2z" stroke={borderColor || "#283971"} strokeWidth="1.5" />
        <Path d="M12 2L2 22h20L12 2z" stroke={borderColor || "#283971"} strokeWidth="1.5" fill={shapeColor || "#96a9e4"} />
    </Svg>
);

const AnswerInput = ({ shape, text, onTextChange, onShapeClick, onValueChange, type, selectedShape }) => {
    const backgroundColors = {
        SQUARE: '#58bdfe',
        CIRCLE: '#484a77',
        TRIANGLE: '#4d65b4',
        STAR: '#323353',
    };

    const renderShape = () => {
        switch (shape) {
            case 'SQUARE':
                return <View style={[styles.shapeStyles.square, { backgroundColor: shape === selectedShape ? COLORS.button.response.correct.light : "#c0e6ff", borderColor: shape === selectedShape ? COLORS.button.response.correct.dark : "#09649f" }]} />;
            case 'CIRCLE':
                return <View style={[styles.shapeStyles.circle, { backgroundColor: shape === selectedShape ? COLORS.button.response.correct.light : "#7577af", borderColor: shape === selectedShape ? COLORS.button.response.correct.dark : "#212248" }]} />;
            case 'TRIANGLE':
                return <Triangle shapeColor={shape === selectedShape ? COLORS.button.response.correct.light : null} borderColor={shape === selectedShape ? COLORS.button.response.correct.dark : null} />;
            case 'STAR':
                return <Star shapeColor={shape === selectedShape ? COLORS.button.response.correct.light : null} borderColor={shape === selectedShape ? COLORS.button.response.correct.dark : null} />;
            default:
                return null;
        }
    };

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const handleValueChange = (uri, id) => {
        setFile(uri);
        setFileName(id);
        onValueChange(id);
    }

    useFocusEffect(useCallback(() => {
        if (type === 'text' && text) {
            if (hasExtension(text)) {
                onValueChange("");
                onTextChange("");
            }
        }
        if (type === 'image' && text) {
            if (hasValidImageExtension(text)) {
                downloadImage(text).then((file) => {
                    const uri = URL.createObjectURL(file);
                    setFile(uri);
                });
            } else {
                onValueChange("");
                onTextChange("");
            }
        }
        if (type === 'audio' && text) {
            if (hasValidAudioExtension(text)) {
                downloadAudio(text).then((file) => {
                    const uri = URL.createObjectURL(file);
                    setFile(uri);
                });
            } else {
                onValueChange("");
                onTextChange("");
            }
        }
    }, [text, type]));


    return (
        <View
            style={[
                styles.container,
                { backgroundColor: shape === selectedShape ? COLORS.button.response.correct.normal : backgroundColors[shape] },
            ]}
        >
            <Pressable style={styles.shapeContainer} onPress={() => onShapeClick(shape)}>
                {renderShape()}
            </Pressable>

            {type === 'text' && (
                <TextInput
                    style={styles.textInput}
                    placeholder="Réponse"
                    onChangeText={onTextChange}
                    value={text}
                />
            )}
            {type === 'image' && (
                <ChooseFile
                    onValueChange={handleValueChange}
                />
            )}
            {type === 'audio' && (
                <ChooseAudio
                    onValueChange={handleValueChange}
                />
            )}
            {type === 'image' && file && hasExtension(text) && (
                <Image source={{ uri: file }} style={styles.selectedImage} />
            )}
            {type === 'audio' && file && hasExtension(text) && (
                <audio controls src={file} type="audio/mp3">
                    <track kind="captions" />
                </audio>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 125,
        paddingHorizontal: 20,
        borderRadius: 25,
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    shapeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        height: '70%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        textAlign: 'left',
    },
    shapeStyles: {
        square: {
            width: 75,
            height: 75,
            borderRadius: 10,
            borderWidth: 5,
        },
        circle: {
            width: 75,
            height: 75,
            borderRadius: 45,
            borderWidth: 5,
        },
    },
    selectedImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
});

export default AnswerInput;
