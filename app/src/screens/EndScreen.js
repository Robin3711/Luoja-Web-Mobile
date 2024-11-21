import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { getPlatformStyle } from '../utils/utils';
import { getNewGameId } from '../utils/api';

const styles = getPlatformStyle();

export default function EndScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { resumeData } = route.params;

    const [score, setScore] = useState(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState(null);
    const [gameId, setGameId] = useState(null);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const savedScore = await AsyncStorage.getItem('score');
                const savedNumberOfQuestions = await AsyncStorage.getItem('numberOfQuestions');
                const savedGameId = await AsyncStorage.getItem('gameId');

                if (savedScore && savedNumberOfQuestions && savedGameId) {
                    setScore(Number(savedScore));
                    setNumberOfQuestions(Number(savedNumberOfQuestions));
                    setGameId(savedGameId);
                } else {
                    setScore(resumeData.score);
                    setNumberOfQuestions(resumeData.numberOfQuestions);
                    setGameId(resumeData.gameId);

                    await AsyncStorage.setItem('score', resumeData.score.toString());
                    await AsyncStorage.setItem('numberOfQuestions', resumeData.numberOfQuestions.toString());
                    await AsyncStorage.setItem('gameId', resumeData.gameId.toString());
                }
            } catch (error) {
                console.error('Erreur de chargement des données:', error);
            }
        };

        loadGameData();

        return () => {
            AsyncStorage.removeItem('score');
            AsyncStorage.removeItem('numberOfQuestions');
            AsyncStorage.removeItem('gameId');
        };
    }, [resumeData]);

    const handleReturnHome = async () => {
        await AsyncStorage.removeItem('score');
        await AsyncStorage.removeItem('numberOfQuestions');
        await AsyncStorage.removeItem('gameId');
        navigation.navigate("menuDrawer");
    };

    const handleReplay = async () => {
        await AsyncStorage.removeItem('score');
        await AsyncStorage.removeItem('numberOfQuestions');
        await AsyncStorage.removeItem('gameId');
        console.log(gameId);
        const newGameId = await getNewGameId(gameId);
        console.log(newGameId.id);
        navigation.navigate('quizScreen', { quizId: newGameId.id });
    };

    return (
        <View style={styles.quizContainer}>
            <View style={styles.quizQuestionContainer}>
                <Text>Fin de partie !</Text>
                {score !== null && numberOfQuestions !== null ? (
                    <Text>Votre score : {score} / {numberOfQuestions}</Text>
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
