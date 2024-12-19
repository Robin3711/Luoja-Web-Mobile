import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ChooseFile from './Choosefile';
import icon from '../../assets/icon.png';

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

const AnswerInput = ({ shape, text, onTextChange, onShapeClick, type }) => {
    const backgroundColors = {
        SQUARE: '#58bdfe',
        CIRCLE: '#484a77',
        TRIANGLE: '#4d65b4',
        STAR: '#323353',
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

    const [file, setFile] = useState(null);

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: backgroundColors[shape] || '#ffffff' },
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
                    onValueChange={(uri) => setFile(uri)}
                />
            )}
            {file && (
                <Image source={{ uri: file }} style={styles.selectedImage} />
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
    selectedImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
});

export default AnswerInput;
