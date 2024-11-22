import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { getPlatformStyle, themeOptions } from '../utils/utils';
import { restartGame, getGameInfos } from '../utils/api';

import * as Progress from 'react-native-progress';

const styles = getPlatformStyle();

export default function EndScreen() {
    const route = useRoute();
    const navigation = useNavigation();

    const { score, numberOfQuestions, gameId } = route.params;

    const [category, setCategory] = useState(null);
    const [difficulty, setDifficulty] = useState(null);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                if (!score || !numberOfQuestions || !gameId) {
                    handleReturnHome();
                }

                const infos = await getGameInfos(gameId);

                setCategory(infos.Category !== 0 ? themeOptions.find(option => option.value === infos.Category)?.label : "any");
                setDifficulty(infos.Difficulty);
            } catch (error) {
                console.error('Erreur de chargement des données:', error);
            }
        };

        loadGameData();
    }, [gameId]);

    const handleReturnHome = async () => {
        navigation.navigate("menuDrawer");
    };

    const handleReplay = async () => {
        const newGameId = await restartGame(gameId);
        navigation.navigate('quizScreen', { gameId: newGameId.id });
    };

    return (
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
                                progress={numberOfQuestions > 0 ? score / numberOfQuestions : 0}
                                size={120}
                                showsText={true}
                                color="#76c7c0"
                                borderWidth={0}
                                thickness={15}
                                textStyle={styles.progressText}
                                unfilledColor="#e12f09"
                                formatText={() => `${Math.round((score / numberOfQuestions) * 100) || 0}%`}
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
    );
}