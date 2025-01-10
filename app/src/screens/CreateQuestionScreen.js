import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import AnswerInput from '../components/AnswerInput';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import { loadFont, mediaType } from '../utils/utils';
import ChoiseSelector from '../components/ChoicePicker';

export default function CreateQuestionScreen() {

    loadFont();

    const route = useRoute();
    const navigation = useNavigation();

    const { question, index, handleQuestion } = route.params;

    const [questionText, setQuestionText] = useState('');
    const [selectedShape, setSelectedShape] = useState('');
    const [showFourAnswers, setShowFourAnswers] = useState(true);
    const [typeQuestion, setType] = useState('text');
    const [fileName, setFileName] = useState(null);

    // Answers state
    const [answers, setAnswers] = useState({
        SQUARE: '',
        TRIANGLE: '',
        CIRCLE: '',
        STAR: '',
    });

    useEffect(() => {
        if (question) {
            setQuestionText(question.text);
            if (question.trueFalse) {
                setShowFourAnswers(false);
                setAnswers({
                    SQUARE: question.correctAnswer,
                    TRIANGLE: question.incorrectAnswers[0],
                });
                setType(question.type)
                setSelectedShape('SQUARE');
            } else {
                setAnswers({
                    SQUARE: question.correctAnswer,
                    TRIANGLE: question.incorrectAnswers[0],
                    CIRCLE: question.incorrectAnswers[1],
                    STAR: question.incorrectAnswers[2],
                });
                setType(question.type)
                setSelectedShape('SQUARE');
            }
        } else {
            setType("text");
            setFileName(null);
        }
    }
        , [question]);

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
            handleQuestion([
                {
                    text: questionText,
                    trueFalse: !showFourAnswers,
                    correctAnswer: answers[selectedShape],
                    incorrectAnswers: Object.values(answers).filter((_, i) => i !== shapes.indexOf(selectedShape)),
                    type: typeQuestion,
                },
            ], index);
        }
        else {
            if (!answers.SQUARE || !answers.TRIANGLE) {
                alert('Veuillez remplir toutes les réponses');
                return;
            }

            handleQuestion([
                {
                    text: questionText,
                    trueFalse: !showFourAnswers,
                    correctAnswer: answers[selectedShape],
                    incorrectAnswers: selectedShape === 'SQUARE' ? [answers.TRIANGLE] : [answers.SQUARE],
                    type: typeQuestion,
                },
            ], index);
        }

        handleReset();

        navigation.goBack();
    };

    const handleValueChange = (shape, id) => {
        setAnswers((prev) => ({ ...prev, [shape]: id }));
        setFileName(id);
    }

    const renderWithCheckmark = (shape) => (
        <View style={styles.answerInputContainer} key={shape}>
            <AnswerInput
                shape={shape}
                text={answers[shape]}
                onTextChange={(text) => handleTextChange(shape, text)}
                onShapeClick={handleShapeClick}
                onValueChange={(id) => handleValueChange(shape, id)}
                type={typeQuestion}
                selectedShape={selectedShape}
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
                        multiline={true}
                        placeholder="Le texte de la question"
                        value={questionText}
                        onChangeText={setQuestionText}
                    />
                    <ChoiseSelector
                        value={typeQuestion}
                        onValueChange={setType}
                        parameters={mediaType}
                        defaultValue={true}
                        style={styles.choiceSelector}
                    />
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>2 réponses</Text>
                        <Switch value={showFourAnswers} onValueChange={handleToggleFourAnswers} />
                        <Text style={styles.toggleLabel}>4 réponses</Text>
                    </View>
                </View>
                <SimpleButton text="Valider" onPress={handleSubmit} />
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
        backgroundColor: COLORS.background.blue,
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
        fontFamily: 'LobsterTwo_400Regular',
        fontSize: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: '10%',
        backgroundColor: 'white',
        borderRadius: 25,
        marginBottom: 25,
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
        left: -35,
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
    choiceSelector: {
        marginTop: 20,
    },
});