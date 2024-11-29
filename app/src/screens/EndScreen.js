import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

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
        navigation.navigate("menuDrawer");
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
        <View style={styles.quizScreenView}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity onPress={() => {
                navigation.navigate('menuDrawer')
            }
            }>
                <Text style={styles.buttonText}>Retour au menu</Text>
            </TouchableOpacity>
        </View>
    ) : (
        <View style={styles.quizContainer}>
            <View style={styles.quizQuestionContainer}>
                <Text>Fin de partie !</Text>
                <Text>Recapitulatif de la partie :</Text>
                <Text>Categorie : {category} | difficulté : {difficulty}</Text>
                {score !== null && numberOfQuestions !== null ? (
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreTitle}>
                            Votre score : {score} / {numberOfQuestions}
                        </Text>
                        <View style={styles.endContainer}>
                            <Progress.Circle
                                progress={!loading ? progress : 0}
                                size={120}
                                showsText={!loading}
                                color={!loading ? "#76c7c0" : "#007AFF"}
                                borderWidth={!loading ? 0 : 10}
                                thickness={15}
                                unfilledColor={!loading ? "#e12f09" : "#f0f0f0"}
                                indeterminate={loading}
                                indeterminateAnimationDuration={1000}
                            />

                        </View>
                    </View>
                ) : (
                    <Text>Chargement du score...</Text>
                )}
            </View>

            <TouchableOpacity
                style={styles.quizNextButton}
                onPress={handleReturnHome}
            >
                <Text style={styles.quizNextButtonText}>
                    Retourner au Menu.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.quizNextButton}
                onPress={handleReplay}
            >
                <Text style={styles.quizNextButtonText}>
                    Rejouer au même quiz.
                </Text>
            </TouchableOpacity>
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
});