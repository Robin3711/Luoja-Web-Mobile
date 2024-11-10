import { View, Text, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getCurrentQuestion, getCurrentAnswer } from '../utils/api';

export default function QuizzScreen() {
    const route = useRoute();
    const { quizData } = route.params;
    const quizId = quizData.quizId;
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [newQuestionNow, setNewQuestionNow] = useState(false);
    const [answerFeedback, setAnswerFeedback] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);

    useEffect(() => {
        handleNewQuestion();
    }, [quizId]);

    const handleNewQuestion = async () => {
        try {
            const data = await getCurrentQuestion(quizId);
            console.log(data);
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
            const { correct, correctAnswer: correctAnswerFromApi } = await getCurrentAnswer(responseData, quizId);
            setNewQuestionNow(true);
            setAnswerFeedback(correct ? 'correct' : 'incorrect');
            setCorrectAnswer(correctAnswerFromApi);
            setIsAnswered(true);
        } catch (error) {
            console.error('Erreur lors de la soumission de la réponse:', error);
        }
    };

    const getAnswerColor = (answer) => {
        if (answer === selectedAnswer && !isAnswered) {
            return 'blue';
        }
        if (answer === selectedAnswer) {
            if (answerFeedback === 'correct') {
                return 'green';
            } else if (answerFeedback === 'incorrect') {
                return 'red';
            }
        }
        if (answer === correctAnswer) {
            return 'green';
        }
        return 'gray';
    };

    return (
        <View>
            <Text>Résultats du Quiz</Text>
            <Text>Quiz ID: {quizId}</Text>
            {currentQuestion ? (
                <>
                    <Text>Question : </Text>
                    <Text>{currentQuestion.question}</Text>
                    {currentQuestion.answers.map((answer, index) => (
                        <Button
                            key={index}
                            title={answer}
                            onPress={() => handleAnswerSelection(answer)}
                            color={getAnswerColor(answer)}
                        />
                    ))}
                    <Button
                        title={newQuestionNow === false ? "Envoyer" : "Question suivante"}
                        onPress={() => {
                            if (!newQuestionNow) {
                                handleGetAnswer();
                            } else {
                                setNewQuestionNow(false);
                                setIsAnswered(false);
                                setSelectedAnswer(null);
                                setAnswerFeedback(null);
                                setCorrectAnswer(null);
                                handleNewQuestion();
                            }
                        }}
                        color="firebrick"
                    />

                </>
            ) : (
                <Text>Chargement de la question...</Text>
            )}
        </View>
    );
}
