import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import { FONT } from '../css/utils/font';
import { themeOptions } from '../utils/utils';
import { restartGame, getGameInfos } from '../utils/api';

import * as Progress from 'react-native-progress';

export default function EndScreen() {
    const route = useRoute();
    const navigation = useNavigation();

    const { score, numberOfQuestions, gameId } = route.params;

    const [category, setCategory] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                if (score === undefined || numberOfQuestions === undefined || gameId === undefined) {
                    handleReturnHome();
                }

                const infos = await getGameInfos(gameId);

                setCategory(infos.Category !== 0 ? themeOptions.find(option => option.value === infos.Category)?.label : "any");
                setDifficulty(infos.Difficulty);
                setLoading(false);

                let animationProgress = 0;
                const targetProgress = score / numberOfQuestions;
                const interval = setInterval(() => {
                    animationProgress += 0.01;
                    if (animationProgress >= targetProgress) {
                        animationProgress = targetProgress;
                        clearInterval(interval);
                    }
                    setProgress(animationProgress);
                }, 20);

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
            navigation.navigate('quizScreen', { gameId: newGameId.id });
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
        }
    };

    return (error ? (
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
                <Text style={styles.text}>Récapitulatif de la partie :</Text>
                <Text style={styles.text}>Catégorie : {category} | difficulté : {difficulty}</Text>
                {score !== null && numberOfQuestions !== null ? (
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreTitle}>
                            Votre score : {score} / {numberOfQuestions}
                        </Text>
                        <View style={styles.wheelContainer}>
                            <Progress.Circle
                                progress={!loading ? progress : 0}
                                size={120}
                                showsText={!loading}
                                color={COLORS.text.blue.dark}
                                borderWidth={!loading ? 0 : 10}
                                thickness={15}
                                unfilledColor={"#D8D8D8"}
                                indeterminate={loading}
                                indeterminateAnimationDuration={1000}
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
    )
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
        backgroundColor: '#f0f0f0',
        backgroundColor: COLORS.background.blue,
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