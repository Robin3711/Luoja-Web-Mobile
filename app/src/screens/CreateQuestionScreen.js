import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AnswerInput from '../components/AnswerInput';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function CreateQuestionScreen() {

    const route = useRoute();
    const navigation = useNavigation();

    const { handleAddQuestions, questionToEdit } = route.params;

    const [questionText, setQuestionText] = useState('');
    const [selectedShape, setSelectedShape] = useState('');
    const [showFourAnswers, setShowFourAnswers] = useState(true);

    // Answers state
    const [answers, setAnswers] = useState({
        SQUARE: '',
        TRIANGLE: '',
        CIRCLE: '',
        STAR: '',
    });
    useEffect(() => {
        if (questionToEdit) {
            setQuestionText(questionToEdit.question);
            if(questionToEdit.type === 'boolean'){
                setShowFourAnswers(false);
                setAnswers({
                    SQUARE: questionToEdit.incorrect_answers[0],
                    TRIANGLE: questionToEdit.correct_answer,
                });
                setSelectedShape('TRIANGLE');
            } else {
                setAnswers({
                    SQUARE: questionToEdit.incorrect_answers[0],
                    TRIANGLE: questionToEdit.incorrect_answers[1],
                    CIRCLE: questionToEdit.incorrect_answers[2],
                    STAR: questionToEdit.correct_answer,
                });
                setSelectedShape('STAR');
            }
        }
    }
    , [questionToEdit]);

    const shapes = ['SQUARE', 'TRIANGLE', ...(showFourAnswers ? ['CIRCLE', 'STAR'] : [])];

    const handleShapeClick = (shape) => setSelectedShape(shape);

    const handleTextChange = (shape, text) =>
        setAnswers((prev) => ({ ...prev, [shape]: text }));

    const handleToggleFourAnswers = () => {
        setShowFourAnswers((prev) => !prev);
        setSelectedShape('');
    };

    const handleReset = () => {
        setQuestionText('');
        setSelectedShape('');
        setAnswers({
            SQUARE: '',
            TRIANGLE: '',
            CIRCLE: '',
            STAR: '',
        });
    }

    const handleSubmit = () => {
        if (!questionText) {
            alert('La question ne peut pas être vide');
            return;
        }

        if (!selectedShape) {
            alert('Veuillez sélectionner une bonne réponse en cliquant sur une forme');
            return;
        }

        if (showFourAnswers) {
            if (!answers.SQUARE || !answers.TRIANGLE || !answers.CIRCLE || !answers.STAR) {
                alert('Veuillez remplir toutes les réponses');
                return;
            }
            
            handleAddQuestions([
                {
                    question: questionText,
                    correct_answer: answers[selectedShape],
                    incorrect_answers: Object.values(answers).filter((_, i) => i !== shapes.indexOf(selectedShape)),
                },
            ]);
        }
        else{
            if (!answers.SQUARE || !answers.TRIANGLE) {
                alert('Veuillez remplir toutes les réponses');
                return;
            }

            handleAddQuestions([
                {
                    question: questionText,
                    correct_answer: answers[selectedShape],
                    incorrect_answers: Object.values(answers).filter((_, i) => i !== shapes.indexOf(selectedShape)),
                },
            ]);
        }

        handleReset();

        navigation.goBack();
    };

    const renderWithCheckmark = (shape) => (
        <View style={styles.answerInputContainer} key={shape}>
            {selectedShape === shape && (
                <MaterialIcons
                    name="check"
                    size={24}
                    color="green"
                    style={styles.checkmarkIcon}
                />
            )}
            <AnswerInput
                shape={shape}
                text={answers[shape]}
                onTextChange={(text) => handleTextChange(shape, text)}
                onShapeClick={handleShapeClick}
            />
        </View>
    );
    
    return (
        <View style={styles.createQuestionView}>
            {/* Left Panel */}
            <View style={styles.createQuestionLeftView}>
                <View style={styles.createQuestionInputView}>
                    <Text style={styles.createQuestionTitle}>Questions :</Text>
                    <TextInput
                        style={styles.createQuestionInput}
                        placeholder="Le texte de la question"
                        value={questionText}
                        onChangeText={setQuestionText}
                    />
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>2 réponses</Text>
                        <Switch value={showFourAnswers} onValueChange={handleToggleFourAnswers} />
                        <Text style={styles.toggleLabel}>4 réponses</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.createQuestionSubmit} onPress={handleSubmit}>
                    <Text>Valider</Text>
                </TouchableOpacity>
            </View>

            {/* Right Panel */}
            <View style={styles.createQuestionRightView}>
                {shapes.map((shape) => renderWithCheckmark(shape))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    createQuestionView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: '100%',
    },
    createQuestionLeftView: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '45%',
        height: '100%',
    },
    createQuestionInputView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#8fd3ff',
        paddingVertical: '5%',
        borderRadius: 25,
        width: '100%',
        height: '70%',
    },
    createQuestionTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: '10%',
        backgroundColor: 'white',
        borderRadius: 25,
    },
    createQuestionInput: {
        width: '90%',
        height: '75%',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 25,
    },
    createQuestionSubmit: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: 80,
        backgroundColor: '#8fd3ff',
        borderRadius: 25,
    },
    createQuestionRightView: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '45%',
        height: '100%',
    },
    answerInputContainer: {
        position: 'relative',
        marginVertical: 10,
    },
    checkmarkIcon: {
        position: 'absolute',
        left: -30,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    toggleLabel: {
        fontSize: 16,
        marginHorizontal: 10,
    },
});