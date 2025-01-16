import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AnswerButton from '../components/AnswerButton';
import { getCurrentRoomQuestion, getCurrentRoomAnswer } from '../utils/api';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Clipboard as Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

import { Audio } from 'expo-av';
import ConfettiContainer from '../components/ConfettiSystem';

import SimpleButton from '../components/SimpleButton';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';
import GradientBackground from '../css/utils/linearGradient';
import { toast } from '../utils/utils';

const { width, height } = Dimensions.get('window');
const isMobile = width < height

export default function RoomQuizScreen() {


    const sound = new Audio.Sound();

    const badSound = require('../../assets/badAnswerSound.mp3');
    const goodSound = require('../../assets/goodAnswerSound.mp3');

    const route = useRoute();
    const navigation = useNavigation();

    const { roomId, eventSource, gameMode } = route.params;

    if (!roomId) {
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

    const [totalQuestion, setTotalQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(0);

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const [isAnswered, setIsAnswered] = useState(false);

    const [correct, setCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);

    const [message, setMessage] = useState("Question en cours...");

    // Timer-related states
    const [remainingTime, setRemainingTime] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [timerInitialized, setTimerInitialized] = useState(false);
    const [timerKey, setTimerKey] = useState(0);
    const [timeStuckAtOne, setTimeStuckAtOne] = useState(false);

    const confettiRef = useRef();

    useEffect(() => {
        (async () => {
            try {
                eventSource.addEventListener('message', handleEvent);

                const data = await getCurrentRoomQuestion(roomId);

                setCurrentQuestion(data);
                setQuestionNumber(1);
            } catch (err) {
                setError(true);
                setErrorMessage(err.status + " " + err.message);
            }
        })();
    }, [roomId]);

    useEffect(() => {
        if (remainingTime > 0 && !timerInitialized) {
            setGameTime(remainingTime);
            setTimerInitialized(true);
        }
        else {
            if (gameMode === "scrum") {
                setGameTime(30);
                setTimerInitialized(false);
            }
        }
    }, [remainingTime]);

    useEffect(() => {
        let timer;
        if (remainingTime === 1) {
            timer = setTimeout(() => {
                setTimeStuckAtOne(true);
            }, 1000);
        } else {
            setTimeStuckAtOne(false);
        }

        return () => clearTimeout(timer);
    }, [remainingTime]);

    useEffect(() => {
        if (timeStuckAtOne && remainingTime === 1) {
            setRemainingTime(0);
            setIsAnswered(true);
        }
    }, [timeStuckAtOne, remainingTime]);

    const handleEvent = (event) => {
        const data = JSON.parse(event.data);
        switch (data.eventType) {
            case "quizInfos":
                setTotalQuestion(data.totalQuestion);

                if  (data.currentQuestion)
                {
                    setQuestionNumber(data.currentQuestion+1);
                    setScore(data.score);
                }
                break;
            case "nextQuestion":
                handleNewQuestion();
                setMessage("Question en cours...");
                break;
            case "correctAnswerFound":
                const { user, correctAnswer } = data;

                setMessage(`${user} a trouvé la bonne réponse !`);

                setCorrect(correctAnswer);
                setIsAnswered(true);
                break;
            case "gameEnd":
                handleEnd();
                break;
            case "timer":
                setRemainingTime(data.remainingTime);
                if (data.remainingTime === 0) {
                    setIsAnswered(true);
                }
                break;
            default:
                break;
        }
    };

    const handleNewQuestion = async () => {
        await sound.unloadAsync();
        try {
            setSelectedAnswer(null);
            setCorrect(null);

            const data = await getCurrentRoomQuestion(roomId);

            setCurrentQuestion(data);
            setIsAnswered(false);
            setQuestionNumber((prevQuestionNumber) => prevQuestionNumber + 1);
            setTimerKey((prevKey) => prevKey + 1);
            setTimerInitialized(false);
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
        }
    };

    const handleAnswerSelection = (answer) => {
        if (!isAnswered) {
            setSelectedAnswer(answer);
        }
    };

    const handleGetAnswer = async () => {
        try {
            const { correctAnswer: correctAnswerFromApi } = await getCurrentRoomAnswer(selectedAnswer, roomId);

            setCorrect(correctAnswerFromApi);
            setIsAnswered(true);
            if (correctAnswerFromApi === selectedAnswer) {
                updateScore();
                confettiRef.current.startConfetti();
            }
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
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
        navigation.navigate('roomEndScreen', {
            roomId: roomId,
            gameMode: gameMode,
        });
    };

    const shapes = ['SQUARE', 'TRIANGLE', 'CIRCLE', 'STAR'];

    const validateAnswerButton = () => (
        <TouchableOpacity
            style={selectedAnswer && !isAnswered ? styles.buttons : styles.disabledButtons}
            onPress={handleGetAnswer}
            disabled={!selectedAnswer || isAnswered}
        >
            <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
    );

    const handleCopyGameId = async () => {
        await Clipboard.setStringAsync(roomId);
        toast('info', 'L\'id à bien été copié !', "", 2000, COLORS.toast.text.blue);
    };

    loadFont();
    return (
        <GradientBackground>
            {!error ? (
                <View style={styles.quizScreenView}>
                    {currentQuestion ? (
                        <>
                            <View style={styles.quizSubScreenView}>
                                <TouchableOpacity onPress={handleCopyGameId} style={styles.roomId}>
                                    <Copy size={24} color="black" />
                                    <Text style={FONT.text}>ID : {roomId} </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.mainView}>

                                <View style={styles.questionView}>

                                    <Text>{message}</Text>

                                    <CountdownCircleTimer
                                        key={timerKey}
                                        isPlaying={timerInitialized}
                                        duration={gameTime}
                                        size={!isMobile ? 150 : 100}
                                        strokeWidth={!isMobile ? 15 : 9}
                                        colors={[COLORS.timer.blue.darker, COLORS.timer.blue.dark, COLORS.timer.blue.normal, COLORS.timer.blue.light, COLORS.timer.blue.lighter]}
                                        colorsTime={[
                                            (gameTime * 4) / 5,
                                            (gameTime * 3) / 5,
                                            (gameTime * 2) / 5,
                                            (gameTime * 1) / 5,
                                            (gameTime * 0) / 5,
                                        ]}
                                        style={{ marginTop: 5 }}
                                    >
                                        {() => (
                                            <>
                                                {gameMode === "team" ? (
                                                    <Text style={styles.questionNumber}>{remainingTime}</Text>
                                                ) : (<Text style={styles.questionNumber}></Text>)}

                                                <Text style={styles.questionNumber}>{questionNumber + " / " + totalQuestion}</Text>
                                            </>
                                        )}
                                    </CountdownCircleTimer>
                                    <Text style={styles.score}>Score: {score}</Text>
                                    <View style={styles.quizBarView}></View>
                                    <Text style={FONT.subTitle}>{currentQuestion.question}</Text>
                                    {!isMobile && validateAnswerButton()}
                                </View>

                                <View style={styles.answersView}>
                                    {currentQuestion.answers.map((answer, index) => (
                                        answer === null ? null : (
                                            <AnswerButton
                                                key={index}
                                                shape={shapes[index]}
                                                text={answer}
                                                onClick={() => handleAnswerSelection(answer)}
                                                color={getAnswerColor(answer)}
                                                type={currentQuestion.type}
                                                disabled={isAnswered}
                                            />
                                        )
                                    ))}
                                    {isMobile && validateAnswerButton()}
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
    quizSubScreenView: {
        width: "100%",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    quizScreenView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    mainView: {
        flexDirection: !isMobile ? 'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        ...!isMobile && { gap: 20, },
    },
    roomId: {
        position: 'absolute',
        top: -90,
        marginRight: 10,
        marginTop: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    roomIdText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    questionView: {
        alignItems: 'center',
        width: !isMobile ? '50%' : '100%',
        ...!isMobile && { gap: 70, },

    },
    question: {
        fontSize: !isMobile ? 30 : 25,
        textAlign: 'center',
        width: !isMobile ? '80%' : '95%',
        fontWeight: 'bold',
        color: COLORS.text.blue.dark,
        ...!isMobile && { marginVertical: 100, },
    },
    questionNumber: {
        fontSize: !isMobile ? 30 : 17,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
        fontWeight: 'bold',
    },
    score: {
        fontSize: !isMobile ? 30 : 12,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
        fontWeight: 'bold',
    },
    answersView: {
        width: !isMobile ? '50%' : '100%',
        alignItems: 'center',

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
    },
    disabledButtons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
        height: 75,
        width: !isMobile ? "35%" : "95%",
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
