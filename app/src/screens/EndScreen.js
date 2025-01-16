import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import { FONT } from '../css/utils/font';
import { restartGame, getGameInfos } from '../utils/api';
import GradientBackground from '../css/utils/linearGradient';

import AnimatedProgressWheel from 'react-native-progress-wheel';

export default function EndScreen() {
    const route = useRoute();
    const navigation = useNavigation();

    const { score, numberOfQuestions, gameId } = route.params;

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);
    const [gameMode, setGameMode] = useState("any");

    useEffect(() => {
        const loadGameData = async () => {
            try {
                if (score === undefined || numberOfQuestions === undefined || gameId === undefined) {
                    handleReturnHome();
                }

                const infos = await getGameInfos(gameId);

                setLoading(false);
                setGameMode(infos.gameMode);
                if (infos.gameMode === null) {
                    setGameMode("standard");
                }

            } catch (err) {
                setError(true);
                setErrorMessage(err.status + " " + err.message);
            }
        };

        loadGameData();
    }, [gameId]);

    const handleReturnHome = async () => {
        navigation.navigate("initMenu");
    };

    const handleReplay = async () => {
        try {
            const newGameId = await restartGame(gameId);
            navigation.navigate('quizScreen', { gameId: newGameId.id, gameMode: gameMode });
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
        }
    };

    return (
        <GradientBackground showLogo={true}>
            {error ? (
            <View style={styles.container}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity style={styles.button} onPress={() => {
                    navigation.navigate('initMenu')
                }
                }>
                    <Text style={styles.buttonText}>Retour au menu</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.container}>
                <View style={styles.parentContainer}>
                    <Text style={FONT.title}>Fin de partie !</Text>
                    {score !== null && numberOfQuestions !== null ? (
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreTitle}>
                                Votre score : {score} / {numberOfQuestions}
                            </Text>
                            <View style={styles.wheelContainer}>
                                <AnimatedProgressWheel
                                    size={125}
                                    width={15} 
                                    duration={2000}
                                    rotation={'-90deg'}
                                    animateFromValue={0}
                                    showProgressLabel={true}
                                    showPercentageSymbol={true}
                                    color={COLORS.palette.blue.dark}
                                    progress={score / numberOfQuestions * 100}
                                />
                            </View>
                        </View>
                    ) : (
                        <Text>Chargement du score...</Text>
                    )}
                </View>

                    <SimpleButton
                        text="Retourner au menu"
                        onPress={handleReturnHome}
                    />

                    <SimpleButton
                        text="Rejouer au Quiz"
                        onPress={handleReplay}
                    />
                </View>
            )}
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    parentContainer: {
        alignItems: 'center',
        margin: 20,
    },
    scoreContainer: {
        alignItems: 'center',
        margin: 20,
    },
    title: {
        textAlign: 'center',
        color: COLORS.text.blue.dark,
        fontSize: 50,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        width: '100%',
        marginBottom: '25%',
    },
    text: {
        fontSize: 25,
        color: COLORS.text.blue.dark,
    },
    scoreTitle: {
        fontSize: 25,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
    },
    wheelContainer: {
        margin: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});