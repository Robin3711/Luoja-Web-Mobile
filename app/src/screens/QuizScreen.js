import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AnswerButton from '../components/AnswerButton';
import { getCurrentQuestion, getCurrentAnswer, getGameInfos, listenTimer } from '../utils/api';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Clipboard as Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { toast } from '../utils/utils';

import ConfettiContainer from '../components/ConfettiSystem';
import { Audio } from 'expo-av';

import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';

import GradientBackground from '../css/utils/linearGradient';
import SimpleButton from '../components/SimpleButton';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;

export default function QuizScreen() {


    const sound = new Audio.Sound();

    const badSound = require('../../assets/badAnswerSound.mp3');
    const goodSound = require('../../assets/goodAnswerSound.mp3');

    const route = useRoute();
    const navigation = useNavigation();
    const { gameId, gameMode } = route.params;

    const audioRefs = useRef([]);

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
    const [remainingTime, setRemainingTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);
    const [gameTime, setGameTime] = useState(0);
    const [timerInitialized, setTimerInitialized] = useState(false);
    const [timerKey, setTimerKey] = useState(0);
    const [animation, setAnimation] = useState('none');

    const confettiRef = useRef();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const infos = await getGameInfos(gameId);
                refreshData(infos);
            } catch (err) {
                setError(true);
                setErrorMessage(err.status + " " + err.message);
            }
        })();
    }, [gameId]);

    useEffect(() => {
        if (remainingTime > 0 && !timerInitialized) {
            setGameTime(remainingTime);
            setTimerInitialized(true);
        }
    }, [remainingTime]);

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
        } finally {
            setLoading(false);
        }
    }

    const handleNewQuestion = async () => {
        try {
            setButtonDisabled(true);
            setSelectedAnswer(null);
            setCorrect(null);

            stopAllAudios();

            const data = await getCurrentQuestion(gameId);
            setCurrentType(data.type);
            await handleListenTimer();

            setCurrentQuestion(data);
            setIsAnswered(false);
            setQuestionNumber(questionNumber + 1);
            setTimerInitialized(false);
            setLoading(false);
            setTimerKey(prevKey => prevKey + 1);
            setAnimation('none');
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
                if (correctAnswerFromApi === selectedAnswer) {
                    confettiRef.current.startConfetti();
                    setAnimation('win');
                    updateScore();
                }
                else {
                    setAnimation('lose');
                }
            }
            setTimerInitialized(false);
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
        } finally {
            setButtonDisabled(false);
        }
    };
    const updateScore = () => setScore(score + 1);

    const getAnswerColor = (answer) => {

        const playSound = async (soundFile) => {
            await sound.unloadAsync();
            await sound.loadAsync({ uri: soundFile });
            await sound.playAsync();
        }

        if (answer === selectedAnswer && !isAnswered) return 'BLUE';
        if (answer === correct) {
            // jouer le son
            if (answer === selectedAnswer) {
                playSound(goodSound);
            }
            return 'GREEN';
        }
        if (answer === selectedAnswer) {
            // jouer le son
            playSound(badSound);
            return 'RED';
        }

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
        if (gameMode) {
            switch (gameMode) {
                case 'timed':
                    await listenTimer(gameId, setRemainingTime, setSelectedAnswer, setLoading);
                    break;
                default:
                    break;
            }
        }
    }

    const stopAllAudios = () => {
        audioRefs.current.forEach(audio => {
            if (audio) {
                audio.stopAudio();
            }
        });
    };

    const shapes = ['SQUARE', 'TRIANGLE', 'CIRCLE', 'STAR'];

    const nextQuestionButton = () => (
        <TouchableOpacity
            style={buttonDisabled || selectedAnswer === null || (gameMode === 'timed' && remainingTime >= 0 && !isAnswered && !selectedAnswer) ? styles.disabledButtons : styles.buttons}
            onPress={async () => {
                await sound.unloadAsync();
                if (gameMode === 'timed' && remainingTime === 0) {
                    totalQuestion === questionNumber ? handleEnd() : handleNewQuestion();
                } else {
                    isAnswered
                        ? totalQuestion === questionNumber
                            ? handleEnd()
                            : handleNewQuestion()
                        : handleGetAnswer();
                }
            }}
            disabled={buttonDisabled || selectedAnswer === null || (gameMode === 'timed' && remainingTime >= 0 && !isAnswered && !selectedAnswer)}
        >
            <Text style={styles.buttonText}>
                {gameMode === 'timed' && remainingTime === 0 ? (
                    buttonDisabled ? 'Chargement de la question suivante...' : (loading ? ('Question suivante') : ('Chargement...'))
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
        toast('info', 'L\'id à bien été copié !', "", 2000, COLORS.toast.text.blue);
    };

    const getTopValue = () => {
        if (!isMobile) return 20;
        return currentQuestion?.question?.length > 60 ? 50 : 20;
    };

    return (
        <GradientBackground>
            {!error ? (
                <View style={styles.quizScreenView}>
                    {currentQuestion ? (
                        <>
                            <TouchableOpacity onPress={handleCopyGameId} style={styles.gameId}>
                                <Copy size={24} color="black" />
                                <Text style={FONT.text}>ID : {gameId} </Text>
                            </TouchableOpacity>
                            <View style={styles.mainView}>
                                <View style={[styles.questionView, { top: getTopValue() }]}>
                                    <CountdownCircleTimer
                                        key={timerKey}
                                        isPlaying={timerInitialized}
                                        duration={gameTime}
                                        size={!isMobile ? 150 : 95}
                                        strokeWidth={!isMobile ? 15 : 9}
                                        colors={[COLORS.timer.blue.darker, COLORS.timer.blue.dark, COLORS.timer.blue.normal, COLORS.timer.blue.light, COLORS.timer.blue.lighter]}
                                        colorsTime={[
                                            (gameTime * 4) / 5,
                                            (gameTime * 3) / 5,
                                            (gameTime * 2) / 5,
                                            (gameTime * 1) / 5,
                                            (gameTime * 0) / 5,
                                        ]}
                                    >
                                        {() => (
                                            <>
                                                {gameMode === "timed" ? (
                                                    <Text style={styles.questionNumber}>{remainingTime}</Text>
                                                ) : (<Text style={styles.questionNumber}></Text>)}

                                                <Text style={styles.questionNumber}>{questionNumber + " / " + totalQuestion}</Text>
                                            </>
                                        )}
                                    </CountdownCircleTimer>

                                    <Text style={[styles.score, { marginTop: 5 }]}>Score: {score}</Text>
                                    <View style={styles.quizBarView}>
                                    </View>
                                    <Text style={FONT.subTitle}>{currentQuestion.question}</Text>
                                    {!isMobile && nextQuestionButton()}
                                </View>

                                <View style={styles.answersView}>
                                    {currentQuestion.answers.map((answer, index) => {
                                        return (
                                            answer === null ? null : (
                                                <AnswerButton
                                                    key={index}
                                                    shape={shapes[index]}
                                                    text={answer}
                                                    onClick={() => handleAnswerSelection(answer)}
                                                    color={getAnswerColor(answer)}
                                                    type={currentType}
                                                    disabled={gameMode === 'timed' && remainingTime === 0}
                                                    animation={animation}
                                                />
                                            )
                                        );
                                    })}
                                    {isMobile && nextQuestionButton()}
                                </View>
                                <ConfettiContainer ref={confettiRef} count={100} colors={[COLORS.palette.blue.lighter, COLORS.palette.blue.normal, COLORS.palette.blue.normal]} />
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
            )}
        </GradientBackground>

    );
}

const styles = StyleSheet.create({
    quizScreenView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    gameId: {
        position: 'absolute',
        top: 1,
        marginRight: 10,
        marginTop: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    gameIdText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mainView: {
        flexDirection: !isMobile ? 'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        ...!isMobile && { gap: 20, },
        ...isMobile && { marginVertical: 10, },
    },
    questionView: {
        alignItems: 'center',
        top: !isMobile ? 20 : 50,
        width: !isMobile ? '45%' : '100%',
        ...isMobile && { marginVertical: 10, },
        ...!isMobile && { gap: 70, },
    },
    question: {
        fontSize: !isMobile ? 30 : 25,
        textAlign: 'center',
        width: !isMobile ? '80%' : '95%',
        fontWeight: 'bold',
        color: COLORS.text.blue.dark,
        ...!isMobile && { marginVertical: 100, },
        ...isMobile && { marginVertical: 10, },
    },
    questionNumber: {
        marginTop: !isMobile ? -20 : -15,
        fontSize: !isMobile ? 30 : 17,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
        fontWeight: 'bold',
        ...isMobile && { marginVertical: 10, },
        ...!isMobile && { marginTop: 0, },
    },
    score: {
        marginBottom: -15,
        fontSize: !isMobile ? 30 : 12,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
        fontWeight: 'bold',
    },
    answersView: {
        width: !isMobile ? '50%' : '100%',
        alignItems: 'center',
        ...isMobile && { marginVertical: 10, },
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8fd3ff',
        height: 75,
        width: !isMobile ? "35%" : "95%",
        borderRadius: 15,
        marginVertical: 10,
        elevation: 2,
        ...isMobile && { marginVertical: 10, },
    },
    disabledButtons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
        height: !isMobile ? 75 : 70,
        width: !isMobile ? "35%" : "95%",
        borderRadius: 15,
        marginVertical: 10,
        elevation: 2,
        ...isMobile && { marginVertical: 10, },
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        ...isMobile && { marginVertical: 10, },
    },
    quizBarView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        ...isMobile && { marginVertical: 10, },
    },
    quizBarTextView: {
        fontSize: 22,
        ...isMobile && { marginVertical: 10, },
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
        ...isMobile && { marginVertical: 10, },
    },
});
