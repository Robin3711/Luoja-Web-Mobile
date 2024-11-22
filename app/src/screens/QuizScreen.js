import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getCurrentQuestion, getCurrentAnswer, getGameInfos } from '../utils/api';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function QuizScreen() {

    const route = useRoute();
    const navigation = useNavigation();

    const { gameId } = route.params;

    if (!gameId) {
        return (
            <View style={styles.quizContainer}>
                <Text style={styles.quizQuestionText}>Une erreur est survenue lors de la récupération de la partie.</Text>
                <Button title="Retour" onPress={() => navigation.navigate('menuDrawer', {
                    screen: 'newQuiz',
                })
                } />
            </View>
        );
    }
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(null);
    const [totalQuestion, setTotalQuestion] = useState(null);

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [fetching, setFetching] = useState(false)

    const [correct, setCorrect] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        (
            async () => {
                const infos = await getGameInfos(gameId);

                setQuestionNumber(infos.questionCursor + 1);
                setTotalQuestion(infos.numberOfQuestions);

                let scoreTemp = 0;

                for (let i = 0; i < infos.questionCursor; i++) {
                    if (infos.results[i]) {
                        scoreTemp++;
                    }
                }

                setScore(scoreTemp);
                handleNewQuestion();
            })();
    }, [gameId]);

    const handleNewQuestion = async () => {
        try {
            setButtonDisabled(true);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setCorrect(null);

            const data = await getCurrentQuestion(gameId);
            setCurrentQuestion(data);

            setButtonDisabled(false);
        } catch (error) {
            console.error('Erreur lors de la récupération de la question:', error);
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

            setFetching(true);

            const { correctAnswer: correctAnswerFromApi } = await getCurrentAnswer({ answer: selectedAnswer }, gameId);

            setFetching(false);

            setCorrect(correctAnswerFromApi);

            setIsAnswered(true);

            if (correctAnswerFromApi === selectedAnswer) {
                updateScore();
            }

            setButtonDisabled(false);
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse:', error);
            setButtonDisabled(false);
        }
    };

    const updateScore = () => {
        setScore(score + 1);
    };

    const getAnswerColor = (answer) => {
        if (answer === selectedAnswer && !isAnswered) {
            return 'blue';
        }
        if (answer === selectedAnswer) {
            return correct === answer ? 'green' : 'red';
        }
        if (answer === correct && selectedAnswer !== answer) {
            return 'green';
        }
        return 'gray';
    };

    const handleEnd = () => {
        navigation.navigate('endScreen', { score: score, numberOfQuestions: totalQuestion, gameId: gameId });
    }

    return (
        <View style={styles.quizContainer}>
            {currentQuestion ? (
                <>
                    <View style={styles.quizQuestionNumberContainer}>
                        <Text style={styles.quizId}>ID: {gameId}</Text>
                        <Text style={styles.quizQuestionText}>Question {questionNumber}/{totalQuestion}</Text>
                        <Text>Score: {score}</Text>
                    </View>
                    <View style={styles.quizQuestionContainer}>
                        <Text style={styles.quizQuestionText}>{currentQuestion.question}</Text>
                    </View>
                    <View style={styles.quizAnswersContainer}>
                        {currentQuestion.answers.map((answer, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.quizAnswerButton,
                                    { backgroundColor: getAnswerColor(answer) },
                                ]}
                                onPress={() => handleAnswerSelection(answer)}
                            >
                                <Text style={styles.quizAnswerText}>{answer}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {
                        !isAnswered ? (
                            <TouchableOpacity
                                style={styles.quizNextButton}
                                onPress={() => {
                                    handleGetAnswer();
                                }}
                                disabled={buttonDisabled || !selectedAnswer}
                            >
                                <Text style={styles.quizNextButtonText}>
                                    {buttonDisabled ? "Chargement..." : "Vérifier ma réponse"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.quizNextButton}
                                onPress={() => {
                                    if (totalQuestion === questionNumber) {
                                        handleEnd();
                                    } else {
                                        handleNewQuestion();
                                        setQuestionNumber(questionNumber + 1);
                                    }
                                }}
                                disabled={buttonDisabled}
                            >
                                <Text style={styles.quizNextButtonText}>
                                    {totalQuestion === questionNumber ? "Voir les résultats" : "Question suivante"}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </>
            ) : (
                <Text style={styles.quizQuestionText}>Chargement de la question...</Text>
            )}
        </View>
    );
}
