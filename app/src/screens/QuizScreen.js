import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AnswerButton from '../components/AnswerButton';
import * as Progress from 'react-native-progress';
import { getCurrentQuestion, getCurrentAnswer, getGameInfos } from '../utils/api';

const platform = Platform.OS;

export default function QuizScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { gameId } = route.params;

    if (!gameId) {
        return (
            <View style={styles.quizContainer}>
                <Text style={styles.quizQuestionText}>
                    Une erreur est survenue lors de la récupération de la partie.
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('menuDrawer', { screen: 'newQuiz' })}>
                    <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(null);
    const [totalQuestion, setTotalQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [correct, setCorrect] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        (async () => {
            const infos = await getGameInfos(gameId);
            setQuestionNumber(infos.questionCursor + 1);
            setTotalQuestion(infos.numberOfQuestions);
            setScore(infos.results.filter(Boolean).length);
            handleNewQuestion();
        })();
    }, [gameId]);

    const handleNewQuestion = async () => {
        try {
            setButtonDisabled(true);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setCorrect(null);
            setQuestionNumber(questionNumber + 1)

            const data = await getCurrentQuestion(gameId);
            setCurrentQuestion(data);
        } catch (error) {
            console.error('Erreur lors de la récupération de la question:', error);
        } finally {
            setButtonDisabled(false);
        }
    };

    const handleAnswerSelection = (answer) => {
        if (!isAnswered) {
            setSelectedAnswer(answer);
        }
    };

    const handleGetAnswer = async () => {
        try {
            setButtonDisabled(true);
            const { correctAnswer: correctAnswerFromApi } = await getCurrentAnswer(
                { answer: selectedAnswer },
                gameId
            );

            setCorrect(correctAnswerFromApi);
            setIsAnswered(true);
            if (correctAnswerFromApi === selectedAnswer) updateScore();
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse:', error);
        } finally {
            setButtonDisabled(false);
        }
    };

    const updateScore = () => setScore(score + 1);

    const getAnswerFilter = (answer) => {
        if (answer === selectedAnswer && !isAnswered) return 'BLUE';
        if (answer === correct) return 'GREEN';
        if (answer === selectedAnswer) return 'RED';
        return 'NONE';
    };

    const handleEnd = () => {
        navigation.navigate('endScreen', {
            score,
            numberOfQuestions: totalQuestion,
            gameId,
        });
    };

    const shapes = ['SQUARE', 'TRIANGLE', 'CIRCLE', 'STAR'];

    const nextQuestionButton = () => (
        <TouchableOpacity
            style={styles.buttons}
            onPress={() =>
                isAnswered
                    ? totalQuestion === questionNumber
                        ? handleEnd()
                        : handleNewQuestion()
                    : handleGetAnswer()
            }
            disabled={buttonDisabled || (!isAnswered && !selectedAnswer)}
        >
            <Text style={styles.buttonText}>
                {isAnswered
                    ? totalQuestion === questionNumber
                        ? 'Voir les résultats'
                        : 'Question suivante'
                    : 'Vérifier ma réponse'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.quizScreenView}>
            {currentQuestion ? (
                <>
                    <Text style={styles.gameId}>ID : {gameId}</Text>
                    <View style={styles.mainView}>
                        <View style={styles.questionView}>
                            <Progress.Circle
                                progress={questionNumber/totalQuestion}
                                size={120}
                                showsText={true}
                                color="white"
                                fill='#8fd3ff'
                                formatText={() => `${questionNumber}`}
                            />
                            <Text>{currentQuestion.question}</Text>
                            <Text>Score: {score}</Text>
                            {platform === 'web' && nextQuestionButton()}
                        </View>

                        <View style={styles.answersView}>
                            {currentQuestion.answers.map((answer, index) => (
                                <AnswerButton
                                    key={index}
                                    shape={shapes[index]}
                                    text={answer}
                                    onClick={handleAnswerSelection}
                                    filter={getAnswerFilter(answer)}
                                />
                            ))}
                            {platform !== 'web' && nextQuestionButton()}
                        </View>
                    </View>
                </>
            ) : (
                <Text>Chargement de la question...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    quizScreenView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    gameId: {
        position: 'absolute',
        top: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mainView: {
        flexDirection: platform === 'web' ? 'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    questionView: {
        alignItems: 'center',
        width: platform === 'web' ? '50%' : '100%',
    },
    answersView: {
        width: platform === 'web' ? '50%' : '100%',
        alignItems: 'center',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8fd3ff',
        height: 50,
        width: 250,
        borderRadius: 15,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
