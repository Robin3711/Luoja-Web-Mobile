import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AnswerButton from '../components/AnswerButton';
import { getCurrentQuestion, getCurrentAnswer, getGameInfos, listenTimer } from '../utils/api';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Clipboard as Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { toast } from '../utils/utils';

import SimpleButton from '../components/SimpleButton';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';


const platform = Platform.OS;

export default function QuizScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { gameId, gameMode } = route.params;

    if (!gameId) {
        return (
            <View style={styles.quizContainer}>
                <Text style={styles.quizQuestionText}>
                    Une erreur est survenue lors de la récupération de la partie.
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('initMenu', { screen: 'newQuiz' })}>
                    <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentType, setCurrentType] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(null);
    const [totalQuestion, setTotalQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [correct, setCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [imagesUri, setImagesUri] = useState([]);
    const [remainingTime, setRemainingTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);


    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const infos = await getGameInfos(gameId);
                refreshData(infos);
            } catch (err) {
                setError(true);
                setErrorMessage(err.status + " " + err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [gameId]);

    const refreshData = async (infos) => {
        try {
            const data = await getCurrentQuestion(gameId);
            setCurrentType(data.type);

            await handleListenTimer();

            if (infos.questionCursor === infos.numberOfQuestions) {
                setQuestionNumber(infos.questionCursor);
            } else {
                setQuestionNumber(infos.questionCursor + 1);
            }

            setTotalQuestion(infos.numberOfQuestions);
            setScore(infos.results.filter(Boolean).length);
            setCurrentQuestion(data);
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
        }
    }

    const handleNewQuestion = async () => {
        try {
            setButtonDisabled(true);
            setSelectedAnswer(null);
            setCorrect(null);

            const data = await getCurrentQuestion(gameId);

            await handleListenTimer();

            setCurrentQuestion(data);
            setIsAnswered(false);
            setQuestionNumber(questionNumber + 1);
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
        } finally {
            setButtonDisabled(false);
        }
    };

    const handleAnswerSelection = (answer) => {
        if (gameMode !== 'timed' || remainingTime > 0) {
            if (!isAnswered) {
                setSelectedAnswer(answer);
            }
        }
    };

    const handleGetAnswer = async () => {
        try {
            setButtonDisabled(true);

            const infos = await getGameInfos(gameId);
            if (infos.questionCursor + 1 !== questionNumber) {
                refreshData(infos);
            } else {
                const { correctAnswer: correctAnswerFromApi } = await getCurrentAnswer(
                    { answer: selectedAnswer },
                    gameId
                );

                setCorrect(correctAnswerFromApi);
                setIsAnswered(true);
                if (correctAnswerFromApi === selectedAnswer) updateScore();
            }
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
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

    const handleListenTimer = async () => {
        if(gameMode){
            switch (gameMode) {
                case 'timed':
                    await listenTimer(gameId, setRemainingTime);
                    break;
                default:
                    break;
            }
        }
    }

    const shapes = ['SQUARE', 'TRIANGLE', 'CIRCLE', 'STAR'];

    const nextQuestionButton = () => (
        <TouchableOpacity
            style={buttonDisabled || (gameMode === 'timed' && remainingTime > 0 && !isAnswered && !selectedAnswer) ? styles.disabledButtons : styles.buttons}
            onPress={() => {
                if (gameMode === 'timed' && remainingTime === 0) {
                    // If game is timed and remaining time is 0, show the next question
                    totalQuestion === questionNumber ? handleEnd() : handleNewQuestion();
                } else {
                    // For other cases, handle the usual button actions
                    isAnswered
                        ? totalQuestion === questionNumber
                            ? handleEnd()
                            : handleNewQuestion()
                        : handleGetAnswer();
                }
            }}
            disabled={buttonDisabled || (gameMode === 'timed' && remainingTime > 0 && !isAnswered && !selectedAnswer)}
        >
            <Text style={styles.buttonText}>
                {gameMode === 'timed' && remainingTime === 0 ? (
                    buttonDisabled ? 'Chargement de la question suivante...' : 'Question suivante'
                ) : isAnswered ? (
                    totalQuestion === questionNumber ? (
                        buttonDisabled ? 'Chargement des résultats...' : 'Voir les résultats'
                    ) : (
                        buttonDisabled ? 'Chargement de la question...' : 'Question suivante'
                    )
                ) : (
                    buttonDisabled ? 'Vérification...' : 'Valider'
                )}
            </Text>
        </TouchableOpacity>
    );

    const handleCopyGameId = async () => {
        await Clipboard.setStringAsync(gameId);
        toast('info', 'L\'id à bien été copié !', "", 2000, 'dodgerblue');
    };


    loadFont();
    return (
        !error ? (
            <View style={styles.quizScreenView}>
                {currentQuestion ? (
                    <>
                        <TouchableOpacity onPress={handleCopyGameId} style={styles.gameId}>
                            <Copy size={24} color="black" />
                            <Text style={styles.gameIdText}>ID : {gameId} </Text>
                        </TouchableOpacity>
                        <View style={styles.mainView}>
                            <View style={styles.questionView}>
                                <CountdownCircleTimer
                                    duration={7}
                                    size={Platform.OS === 'web' ? 150 : 110}
                                    strokeWidth={Platform.OS === 'web' ? 15 : 10}
                                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                    colorsTime={[7, 5, 2, 0]}
                                >
                                    {() => (
                                        <Text style={styles.questionNumber}>{questionNumber + " / " + totalQuestion}</Text>
                                    )}
                                </CountdownCircleTimer>
                                <Text style={styles.questionNumber}>{remainingTime}</Text>
                                <Text style={styles.questionNumber}>Score: {score}</Text>
                                <View style={styles.quizBarView}>
                                </View>
                                <Text style={styles.question}>{currentQuestion.question}</Text>
                                {platform === 'web' && nextQuestionButton()}
                            </View>

                            <View style={styles.answersView}>
                                {currentQuestion.answers.map((answer, index) => (
                                    <AnswerButton
                                        key={index}
                                        shape={shapes[index]}
                                        text={answer}
                                        onClick={() => handleAnswerSelection(answer)}
                                        filter={getAnswerFilter(answer)}
                                        type={currentType}
                                        disabled={gameMode === 'timed' && remainingTime === 0}
                                    />
                                ))}
                                {platform !== 'web' && nextQuestionButton()}
                            </View>
                        </View>
                    </>
                ) : (
                    <Text>Chargement...</Text>
                )}
            </View>
        ) : (
            <View style={styles.quizScreenView}>
                <Text style={styles.errorText}>{errorMessage}</Text>

                <SimpleButton text="Retour au menu" onPress={() => navigation.navigate('initMenu', { screen: 'newQuiz' })} />

            </View>
        )

    );
}

const styles = StyleSheet.create({
    quizScreenView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        backgroundColor: COLORS.background.blue,
    },
    gameId: {
        position: 'absolute',
        top: 1,
        marginRight: 10,
        marginTop: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameIdText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mainView: {
        flexDirection: platform === 'web' ? 'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        ...platform === 'web' && { gap: 20, },
    },
    questionView: {
        alignItems: 'center',
        width: platform === 'web' ? '50%' : '100%',
    },
    question: {
        fontSize: platform === 'web' ? 30 : 25,
        textAlign: 'center',
        width: platform === 'web' ? '80%' : '95%',
        fontWeight: 'bold',
        color: COLORS.text.blue.dark,
        ...platform === 'web' && { marginVertical: 100, },
    },
    questionNumber: {
        fontSize: platform === 'web' ? 30 : 25,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
        fontWeight: 'bold',
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
        height: 75,
        width: platform === 'web' ? "35%" : "95%",
        borderRadius: 15,
        marginVertical: 10,
        elevation: 2,
    },
    disabledButtons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
        height: 75,
        width: platform === 'web' ? "35%" : "95%",
        borderRadius: 15,
        marginVertical: 10,
        elevation: 2,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    quizBarView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    quizBarTextView: {
        fontSize: 22,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
});
