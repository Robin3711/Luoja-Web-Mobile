import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity, Image, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

import Animated, { 
    interpolate, 
    useAnimatedStyle, 
    useSharedValue, 
    withRepeat, 
    withTiming 
} from 'react-native-reanimated';

import { COLORS } from '../css/utils/color';
import { downloadAudio, downloadImage } from '../utils/api';
import { toast } from '../utils/utils';

// ** Constantes **

const { width  , height} = Dimensions.get('window');
const isMobile = width< height

const platform = Platform.OS;

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

// ** Fin Composants **

const AnswerButton = forwardRef(({ shape, onClick, text, color, type, animation }, ref) => {

    // ** Constantes **

    const backgroundColors = {
        SQUARE: '#58bdfe',
        CIRCLE: '#484a77',
        TRIANGLE: '#4d65b4',
        STAR: '#323353',
    };

    const shapeColors = {
        GREEN: COLORS.button.response.correct.light,
        RED: COLORS.button.response.incorrect.light,
    };

    const borderColors = {
        GREEN: COLORS.button.response.correct.dark,
        RED: COLORS.button.response.incorrect.dark,
    };

    const answerColors = {
        GREEN: COLORS.button.response.correct.normal,
        RED: COLORS.button.response.incorrect.normal,
    }

    // ** Fin Constantes **

    // ** Rendu Formes **

    const renderShape = () => {
        const shapeColor = shapeColors[color];
        const borderColor = borderColors[color];
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

    // ** Fin Rendu Formes **

    // ** Media **

    const [file, setFile] = useState(null);
    const fileRef = useRef(null);
    const sound = useRef(new Audio.Sound());

    useImperativeHandle(ref, () => ({
        stopAudio: async () => {
            console.log('stopAudio');

            if (sound.current) {
                console.log('ref', ref);
    
                await sound.current.stopAsync();
            }
        }
    }));

    async function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    const playSound = async () => {
        try {
            await sound.current.unloadAsync();
            await sound.current.loadAsync({ uri: file });
            await sound.current.playAsync();
        } catch (error) {
            toast("error", 'Erreur lors de la lecture du son', '', 1500, COLORS.toast.text.red);
        }
    };  

    useEffect(() => {

        if (platform === 'web') {
            async function handleMedia() {
                if (type === 'image' && text) {
                    const file = await downloadImage(text);
                    const url = URL.createObjectURL(file);
                    setFile(url);
                }

                if (type === 'audio' && text) {
                    const file = await downloadAudio(text);
                    let url;
                    if (platform === 'web') {
                        url = URL.createObjectURL(file);
                        setFile(url);
                    } else {
                        url = file;
                        setFile(url);
                    }

                    await sound.current.loadAsync({ uri: url });

                }
            }
            handleMedia();

            return () => {
                sound.current.unloadAsync();
            };

        } else {
            async function handleMedia() {
                let fileUri = null;
                try {
                    if (type === 'image' && text) {
                        const blob = await downloadImage(text);
                        fileUri = FileSystem.documentDirectory + `${text}`;
                        const base64Data = await blobToBase64(blob);
                        await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
                        setFile(fileUri);
                        fileRef.current = fileUri;
                    }

                    if (type === 'audio' && text) {
                        const blob = await downloadAudio(text);
                        fileUri = FileSystem.documentDirectory + `${text}`;
                        const base64Data = await blobToBase64(blob);
                        await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
                        setFile(fileUri);
                        fileRef.current = fileUri;
                        await sound.current.loadAsync({ uri: fileUri });
                    }
                } catch (error) {
                    toast('error', 'Erreur lors du traitement des fichiers média', '', 1500, COLORS.toast.text.red);
                }
            }

            handleMedia();

            return () => {
                async function cleanup() {
                    try {
                        if (sound.current) {
                            await sound.current.unloadAsync();
                        }
                        if (fileRef.current) {
                            const exists = await FileSystem.getInfoAsync(fileRef.current);
                            if (exists.exists) {
                                await FileSystem.deleteAsync(fileRef.current, { idempotent: true });
                            }
                        }
                    } catch (error) {
                        toast('error', 'Erreur lors du nettoyage des fichiers', '', 2000, COLORS.toast.text.red);
                    }
                }
                cleanup();
            };
        }

    }, [text, type]);

    // ** Fin Media **

    // ** Animation **

    // 0.5 = rotation de base
    const rotation = useSharedValue(0.5);
    const translation = useSharedValue(0.5);

    useEffect(() => {
        if (animation === 'win' && color === 'GREEN') {

            // Aller à 0 
            rotation.value = withTiming(0, { duration: 100 }, () => {
                // Commencer l'animation de rotation
                rotation.value = withRepeat(
                    withTiming(1, { duration: 100 }),
                    5, // Répéter 5 fois
                    true, // Alterner la direction
                    () => {
                        // Retour à 0.5
                        rotation.value = withTiming(0.5, { duration: 100 });
                        }
                );
            });
        }
        else if (animation === 'lose' && color === 'RED') {
            //Aller à 0
            translation.value = withTiming(0, { duration: 100 }, () => {
                // Commencer l'animation de translation
                translation.value = withRepeat(
                    withTiming(1, { duration: 100 }),
                    3, // Répéter 1 fois
                    true, // Alterner la direction
                    () => {
                        // Retour à 0.5
                        translation.value = withTiming(0.5, { duration: 100 });
                    }
                );
            });
        }            
    }, [animation]);

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(rotation.value, [0, 1], [-1.5, 1.5]);
        const translate = interpolate(translation.value, [0, 1], [-25, 25]);

        console.log(translation.value)

        return {
            transform: [
                { rotate: `${rotate}deg` },
                { translateX: translate },
            ],    
        };
    });

    // ** Fin Animation **

    // ** JSX **

    return (
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
            <TouchableOpacity
                onPress={() => onClick(text)}
                style={[
                    styles.container,
                    {
                        backgroundColor: answerColors[color] || backgroundColors[shape],
                        borderColor: 'black', borderWidth: color === 'BLUE' ? 7 : 0,
                        height: !isMobile ? 160 : 80,
                        width: color === 'BLUE' ? '90%' : '95%',
                        marginVertical: color === 'BLUE' ? 10 : 5,
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
                        <TouchableOpacity onPress={playSound} style={styles.button}>
                            <Text style={styles.text}>Play</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={async () => { sound.current.pauseAsync() }} style={styles.button}>
                            <Text style={styles.text}>Pause</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={async () => { sound.current.stopAsync() }} style={styles.button}>
                            <Text style={styles.text}>Stop</Text>
                        </TouchableOpacity>
                    </>
                )}
            </TouchableOpacity>
        </Animated.View>
    );

    // ** End JSX **
});

// ** Style **

const styles = StyleSheet.create({
    animatedContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
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
        fontSize: !isMobile ? 25 : 18,
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
        width: !isMobile ? 100 : 60,
        height: !isMobile ? 100 : 60,
        resizeMode: 'cover',
    },
    button: {
        position: 'relative',
        backgroundColor: COLORS.button.blue.basic,
        height: !isMobile ? 50 : 40,
        width: !isMobile ? 100 : 80,
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

// ** Fin Style **

export default AnswerButton;
