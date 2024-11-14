import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getCurrentQuestion, getCurrentAnswer, getCurrentInfos } from '../utils/api';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function QuizScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { quizData } = route.params;

    if (quizData.error) {
        return (
            <View style={styles.quizContainer}>
                <Text style={styles.quizQuestionText}>{quizData.error}</Text>
                <Button title="Retour" onPress={() => navigation.navigate('Parameters')} />
            </View>
        );
    }

    const quizId = quizData.quizId;
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [newQuestionNow, setNewQuestionNow] = useState(false);
    const [correct, setCorrect] = useState(null);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(null);
    const [totalQuestion, setTotalQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        (async () => {
            const infos = await getCurrentInfos(quizId);
            setCurrentQuestionNumber(infos.questionCursor + 1);
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
    }, [quizId]);

    const handleNewQuestion = async () => {
        try {
            setButtonDisabled(true);
            setNewQuestionNow(false);
            setIsAnswered(false);
            setSelectedAnswer(null);
            setCorrect(null);
            const data = await getCurrentQuestion(quizId);
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
        const responseData = { answer: selectedAnswer };

        try {
            setButtonDisabled(true);
            const { correct: correctAnswerFromApi } = await getCurrentAnswer(responseData, quizId);
            setNewQuestionNow(true);
            setCorrect(correctAnswerFromApi);
            setIsAnswered(true);
            if (correctAnswerFromApi) {
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
            return correct ? 'green' : 'red';
        }
        return 'gray';
    };

    const handleEnd = () => {
        const data = { score: score, gameId: quizId };
        navigation.navigate('ResumeQuiz', { resumeData: data });
    };

    return (
        <View style={styles.quizContainer}>
            {currentQuestion ? (
                <>
                    <View style={styles.quizQuestionNumberContainer}>
                        <Text style={styles.quizId}>ID: {quizId}</Text>
                        <Text style={styles.quizQuestionText}>Question {currentQuestionNumber}/{totalQuestion}</Text>
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
                        newQuestionNow === false ? (
                            <TouchableOpacity
                                style={styles.quizNextButton}
                                onPress={() => {
                                    handleGetAnswer();
                                }}
                                disabled={buttonDisabled || !selectedAnswer}
                            >
                                <Text style={styles.quizNextButtonText}>
                                    {buttonDisabled ? "Chargement..." : "Envoie de la réponse"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.quizNextButton}
                                onPress={() => {
                                    if (totalQuestion === currentQuestionNumber) {
                                        handleEnd();
                                    } else {
                                        handleNewQuestion();
                                        setCurrentQuestionNumber(currentQuestionNumber + 1);
                                    }
                                }}
                                disabled={buttonDisabled}
                            >
                                <Text style={styles.quizNextButtonText}>
                                    {totalQuestion === currentQuestionNumber ? "Voir les résultats" : "Question suivante"}
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
