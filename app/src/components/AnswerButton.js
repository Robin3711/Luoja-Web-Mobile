import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity,  Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../css/utils/color';
import { downloadImage, downloadAudio } from '../utils/api';
import { Audio } from 'expo-av';



const { width  , height} = Dimensions.get('window');
const isMobile = width< height

const Star = ({ shapeColor, borderColor }) => (
    <Svg width={!isMobile ? "115" : "75"} height="115" viewBox="-2 -2 28 28" fill="none">
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
    <Svg width={!isMobile ? "115" : "75"} height="115" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 22h20L12 2z" stroke={borderColor || "#283971"} strokeWidth="1.5" />
        <Path d="M12 2L2 22h20L12 2z" stroke={borderColor || "#283971"} strokeWidth="1.5" fill={shapeColor || "#96a9e4"} />
    </Svg>
);

const AnswerButton = ({ shape, onClick, text, filter, type }) => {
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

    const [sound, setSound] = useState(null); 

    // Fonction pour lire l'audio
    const playSound = async () => {
        if (sound) {
        await sound.playAsync();
        }
    };

    // Fonction pour mettre l'audio en pause
    const pauseSound = async () => {
        if (sound) {
        await sound.pauseAsync();
        }
    };

    // Fonction pour arrêter l'audio
    const stopSound = async () => {
        if (sound) {
        await sound.stopAsync();
        }
    };

    useEffect(() => {
        async function loadSound() {
          if (type === 'audio' && file) {
            const { sound } = await Audio.Sound.createAsync({ uri: file });
            setSound(sound);
          }
        }
        loadSound();
    
        // Libérer les ressources lorsque le composant est démonté ou lorsque le son change
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [file]);

    useEffect(() => {
        async function handleMedia() {
            if (type === 'image' && text) {
              const file = await downloadImage(text);
              setFile(file);
            }
      
            if (type === 'audio' && text) {
              const file = await downloadAudio(text);
              setFile(file);
            }
          }
          handleMedia();
    }, [text, type]);

    return (
        <TouchableOpacity
            onPress={() => onClick(text)}
            style={[
                styles.container,
                {
                    backgroundColor: questionFilters[filter] || backgroundColors[shape],
                    borderColor: 'black', borderWidth: filter === 'BLUE' ? 7 : 0,
                    height: isMobile ? filter === 'BLUE' ? 150 : 160 : filter === 'BLUE' ? 90 : 100,
                    width: filter === 'BLUE' ? '90%' : '95%',
                    marginVertical: filter === 'BLUE' ? 10 : 5,
                },
            ]}
        >
            {renderShape()}
            {type === "text" && (
                <Text style={styles.text}>{text}</Text>
            )}
            {type === "image" && (
                <Image
                    source={{ uri: file }}
                    style={styles.Image}
                />
            )}
            {type === "audio" && (
                <>
                    <TouchableOpacity onPress={() => playSound} style={styles.button}>
                        <Text style={styles.text}>Play</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pauseSound} style={styles.button}>
                        <Text style={styles.text}>Pause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => stopSound} style={styles.button}>
                        <Text style={styles.text}>Stop</Text>
                    </TouchableOpacity>
                </>
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
        ...!isMobile ? {
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
            width: !isMobile ? 115 : 75,
            height: !isMobile ? 115 : 75,
            borderRadius: 10,
            borderWidth: !isMobile ? 7 : 5,
        },
        circle: {
            width: !isMobile ? 115 : 75,
            height: !isMobile ? 115 : 75,
            borderRadius: !isMobile ? 70 : 45,
            borderWidth: !isMobile ? 7 : 5,
        },
    },
    Image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    button: {
        position: 'relative', // Permet de positionner le texte absolument par rapport au bouton
        backgroundColor: COLORS.button.blue.basic,
        height: 50,
        width: 100,
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 25,
        alignItems: 'center',
        justifyContent: 'center',
        ...!isMobile ? {
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
        } : { elevation: 2 },
    },
});

export default AnswerButton;
