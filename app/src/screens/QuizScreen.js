import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getCurrentQuestion, getCurrentAnswer, getCurrentInfos } from '../utils/api';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function QuizScreen() {
    const route = useRoute();
    const { quizData } = route.params;
    const quizId = quizData.quizId;
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [newQuestionNow, setNewQuestionNow] = useState(false);
    const [correct, setCorrect] = useState(null);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(null);
    const [totalQuestion, setTotalQuestion] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        (async () => {
            handleNewQuestion();
            const infos = await getCurrentInfos(quizId);
            setCurrentQuestionNumber(infos.questionCursor + 1);
            setTotalQuestion(infos.numberOfQuestions);
            for (let i = 0; i < infos.questionCursor; i++) {
                if (infos.results[i]) {
                    setScore(score + 1);
                }
            }
        })()
    }, [quizId]);

    const handleNewQuestion = async () => {
        try {
            const data = await getCurrentQuestion(quizId);
            setCurrentQuestion(data);
        } catch (error) {
            console.error('Erreur lors de la récupération de la question:', error);
        }
    };

    const handleAnswerSelection = (answer) => {
        if (!isAnswered) {
            setSelectedAnswer(answer);
        }
    };

    const handleGetAnswer = async () => {
        if (!selectedAnswer) {
            alert('Veuillez sélectionner une réponse !');
            return;
        }

        const responseData = {
            answer: selectedAnswer,
        };

        try {
            const { correct: correctAnswerFromApi } = await getCurrentAnswer(responseData, quizId);
            setNewQuestionNow(true);
            setCorrect(correctAnswerFromApi);
            setIsAnswered(true);
            if (correctAnswerFromApi) {
                updateScore();
            }
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse:', error);
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
            if (correct) {
                return 'green';
            } else {
                return 'red';
            }
        }
        return 'gray';
    };

    const handleCreateQuiz = () => {
        const data = {}
        // navigation.navigate('ResumeQuiz', { resumeData:  });
    };


    return (
        <View style={quizStyle.container}>
            {currentQuestion ? (
                <>
                    <View style={quizStyle.questionNumberContainer}>
                        <Text style={quizStyle.quizId}>ID: {quizId}</Text>
                        <Text style={quizStyle.questionText}>Question {currentQuestionNumber}/{totalQuestion}</Text>
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
                    <TouchableOpacity
                        style={styles.quizNextButton}
                        onPress={() => {
                            if (!newQuestionNow) {
                                handleGetAnswer();
                            } else {
                                setNewQuestionNow(false);
                                setIsAnswered(false);
                                setSelectedAnswer(null);
                                setCorrect(null);
                                setCurrentQuestionNumber(currentQuestionNumber + 1);
                                handleNewQuestion();
                            }
                        }}
                    >
                        <Text style={styles.quizNextButtonText}>
                            {newQuestionNow === false ? "Envoyer" : "Question suivante"}
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.quizQuestionText}>Chargement de la question...</Text>
            )}
        </View>
    );
}
