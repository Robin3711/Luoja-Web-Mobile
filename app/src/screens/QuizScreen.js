import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AnswerButton from '../components/AnswerButton';
import * as Progress from 'react-native-progress';
import { getCurrentQuestion, getCurrentAnswer, getGameInfos } from '../utils/api';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Clipboard as Copy } from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { toast } from '../utils/utils';

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
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);


    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const infos = await getGameInfos(gameId);
                const data = await getCurrentQuestion(gameId);

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
            } finally {
                setLoading(false);
            }
        })();
    }, [gameId]);

    const handleNewQuestion = async () => {
        try {
            setButtonDisabled(true);
            setSelectedAnswer(null);
            setCorrect(null);

            const data = await getCurrentQuestion(gameId);
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
                {isAnswered ? (
                    totalQuestion === questionNumber ? (
                        buttonDisabled ? 'Chargement des résultats...' : 'Voir les résultats'
                    ) : (
                        buttonDisabled ? 'Chargement de la question...' : 'Question suivante'
                    )
                ) : (
                    buttonDisabled ? 'Vérification...' : 'Vérifier ma réponse'
                )}
            </Text>

        </TouchableOpacity>
    );

    const handleCopyGameId = () => {
        Clipboard.setString(gameId);
        toast('info', 'L\'id à bien été copier !', "", 2000);
    };

    console.log('questionNumber', questionNumber);
    console.log('totalQuestion', totalQuestion);
    console.log('progress', questionNumber / totalQuestion);

    return (
        !error ? (
            <View style={styles.quizScreenView}>
                {currentQuestion ? (
                    <>
                        <View style={styles.gameId}>
                            <Text style={styles.gameIdText}>ID : {gameId} </Text>
                            <TouchableOpacity onPress={handleCopyGameId}>
                                <Copy size={20} />
                            </TouchableOpacity>
                            <Toast ref={(ref) => Toast.setRef(ref)} />
                        </View>
                        <View style={styles.mainView}>
                            <View style={styles.questionView}>
                                <CountdownCircleTimer
                                    duration={7}
                                    size={100}
                                    strokeWidth={10}
                                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                    colorsTime={[7, 5, 2, 0]}
                                >
                                    {({ remainingTime }) => (
                                        <Text>{questionNumber}</Text>
                                    )}
                                </CountdownCircleTimer>
                                <View style={styles.quizBarView}>
                                    <Text style={styles.quizBarTextView}>1 </Text>
                                    <Progress.Bar
                                        borderRadius={0}
                                        height={10}
                                        progress={questionNumber / totalQuestion}
                                        width={platform === 'web' ? 400 : 200}
                                        indeterminate={loading}
                                        indeterminateAnimationDuration={2000}
                                    />
                                    <Text style={styles.quizBarTextView}> {totalQuestion}</Text>
                                </View>
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
        ) : (
            <View style={styles.quizScreenView}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('menuDrawer', { screen: 'newQuiz' })
                }
                }>
                    <Text style={styles.buttonText}>Retour au menu</Text>
                </TouchableOpacity>
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
    },
    gameId: {
        position: 'absolute',
        top: 1,
        flexDirection: "row",
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
