import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AnswerButton from '../components/AnswerButton';
import { getCurrentRoomQuestion, getCurrentRoomAnswer } from '../utils/api';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import SimpleButton from '../components/SimpleButton';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';


const platform = Platform.OS;

export default function QuizScreen() {
    const route = useRoute();
    const navigation = useNavigation();

    const { roomId, eventSource } = route.params;

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

    useEffect(() => {
        (async () => {
            try {
                eventSource.onmessage = handleEvent;

                const data = await getCurrentRoomQuestion(roomId);

                setCurrentQuestion(data);
                setQuestionNumber(1);
            } catch (err) {
                setError(true);
                setErrorMessage(err.status + " " + err.message);
            }
        })();
    }, [roomId]);

    const handleEvent = (event) => {
        const data = JSON.parse(event.data);

        switch (data.eventType) {
            case "quizInfos":
                setTotalQuestion(data.totalQuestion);
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
            default:
                break;
        }
    }

    const handleNewQuestion = async () => {
        try {
            setSelectedAnswer(null);
            setCorrect(null);

            const data = await getCurrentRoomQuestion(roomId);

            setCurrentQuestion(data);
            setIsAnswered(false);
            setQuestionNumber((prevQuestionNumber) => prevQuestionNumber + 1); // Use functional update
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
            if (correctAnswerFromApi === selectedAnswer) updateScore();
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
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
        navigation.navigate('roomEndScreen', {
            roomId
        });
    };

    const shapes = ['SQUARE', 'TRIANGLE', 'CIRCLE', 'STAR'];

    const validateAnswerButton = () => {
        if (selectedAnswer && !isAnswered) {
            return (
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={handleGetAnswer}
                >
                    <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.disabledButtons}
                    disabled={true}
                >
                    <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
            );
        }
    }

    loadFont();
    return (
        !error ? (
            <View style={styles.quizScreenView}>
                {currentQuestion ? (
                    <>
                        <View style={styles.mainView}>
                            <View style={styles.questionView}>
                                <Text>{message}</Text>

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
                                <Text style={styles.questionNumber}>Score: {score}</Text>
                                <View style={styles.quizBarView}>
                                </View>
                                <Text style={styles.question}>{currentQuestion.question}</Text>
                                {platform === 'web' && validateAnswerButton()}
                            </View>

                            <View style={styles.answersView}>
                                {currentQuestion.answers.map((answer, index) => (
                                    <AnswerButton
                                        key={index}
                                        shape={shapes[index]}
                                        text={answer}
                                        onClick={() => handleAnswerSelection(answer)}
                                        filter={getAnswerFilter(answer)}
                                        disabled={isAnswered}
                                    />
                                ))}
                                {platform !== 'web' && validateAnswerButton()}
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
