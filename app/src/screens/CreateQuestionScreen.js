import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TextInput, Picker, ActivityIndicator } from 'react-native';
import AnswerInput from '../components/AnswerInput';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';
import SimpleButton from '../components/SimpleButton';
import { mediaType, toast } from '../utils/utils';
import ChoiseSelector from '../components/ChoicePicker';
import { generateAnswers } from '../utils/api';
import GradientBackground from '../css/utils/linearGradient';

export default function CreateQuestionScreen() {
    const route = useRoute();
    const navigation = useNavigation();

    const { question, index, handleQuestion } = route.params;

    const [questionText, setQuestionText] = useState('');
    const [selectedShape, setSelectedShape] = useState('');
    const [numAnswers, setNumAnswers] = useState(4); // Par défaut à 4 réponses
    const [typeQuestion, setType] = useState('text');
    const [generationTheme, setGenerationTheme] = useState('standard');
    const [loading, setLoading] = useState(false);
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
            const numAns = question.incorrectAnswers.length + 1;
            setNumAnswers(numAns);
            setAnswers({
                SQUARE: question.correctAnswer,
                TRIANGLE: question.incorrectAnswers[0] || '',
                CIRCLE: question.incorrectAnswers[1] || '',
                STAR: question.incorrectAnswers[2] || '',
            });
            setType(question.type);
            setSelectedShape('SQUARE');
        } else {
            setType("text");
            setFileName(null);
        }
    }, [question]);

    useEffect(() => {
        // Synchronise l'état des réponses avec le nombre de réponses
        setAnswers((prev) => {
            const newAnswers = { ...prev };
            if (numAnswers < 4) newAnswers.STAR = '';
            if (numAnswers < 3) newAnswers.CIRCLE = '';
            return newAnswers;
        });
    }, [numAnswers]);

    const shapes = ['SQUARE', 'TRIANGLE', ...(numAnswers >= 3 ? ['CIRCLE'] : []), ...(numAnswers >= 4 ? ['STAR'] : [])];

    const handleShapeClick = (shape) => setSelectedShape(shape);

    const handleTextChange = (shape, text) =>
        setAnswers((prev) => ({ ...prev, [shape]: text }));

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
            toast('error', 'La question ne peut pas être vide', '', 3000, COLORS.toast.text.red);
            return;
        }

        if (!selectedShape) {
            toast('error', 'Veuillez sélectionner une bonne réponse en cliquant sur une forme', '', 3000, COLORS.toast.text.red);
            return;
        }

        const requiredAnswers = shapes.map((shape) => answers[shape]);
        if (requiredAnswers.some((answer) => !answer)) {
            toast('error', `Veuillez remplir toutes les ${numAnswers} réponses`, '', 3000, COLORS.toast.text.red);
            return;
        }

        const incorrectAnswers = shapes.filter((shape) => shape !== selectedShape).map((shape) => answers[shape]);

        handleQuestion([
            {
                text: questionText,
                trueFalse: false,
                correctAnswer: answers[selectedShape],
                incorrectAnswers: incorrectAnswers,
                type: typeQuestion,
            },
        ], index);

        handleReset();
        navigation.goBack();
    };

    const handleValueChange = (shape, id) => {
        setAnswers((prev) => ({ ...prev, [shape]: id }));
        setFileName(id);
    }

    const handleGenerate = async () => {

        if (questionText.length > 0) {


            try {
                setLoading(true);

                setType('text');

                const data = await generateAnswers(questionText, generationTheme);

                const answers = data.answers;

                setAnswers({
                    SQUARE: answers[0],
                    TRIANGLE: answers[1],
                    CIRCLE: answers[2],
                    STAR: answers[3],
                });

                setSelectedShape('SQUARE');
                setLoading(false);
            }
            catch (error) {
                if (error.status && error.message) {
                    toast("error", error.status, error.message, 1500, COLORS.toast.text.red);
                } else {
                    toast('error', 'Erreur', error, 1500, COLORS.toast.text.red);
                }

                if (error.status === 400 || error.status === 500) {
                    setLoading(false);
                }

                return;
            }
        }
    };


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
        <GradientBackground>
            <View style={styles.createQuestionView}>
                {/* Left Panel */}
                <View style={styles.createQuestionLeftView}>
                    <View style={styles.createQuestionInputView}>
                        <Text style={FONT.title}>Question :</Text>
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
                            <Text style={styles.toggleLabel}>Nombre de réponses :</Text>
                            <Picker
                                selectedValue={numAnswers}
                                onValueChange={(value) => {
                                    setNumAnswers(value);
                                    setSelectedShape('');
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item style={FONT.text} label="2 réponses" value={2} />
                                <Picker.Item style={FONT.text} label="3 réponses" value={3} />
                                <Picker.Item style={FONT.text} label="4 réponses" value={4} />
                            </Picker>
                        </View>
                    </View>
                    <SimpleButton text="Valider" onPress={handleSubmit} />
                </View>

                {/* Right Panel */}
                <View style={styles.createQuestionRightView}>
                    <View style={styles.generateAnswersButtonView}>
                        <SimpleButton text="Générer des réponses" onPress={handleGenerate} disabled={loading} />
                        {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
                    </View>
                    <Picker
                        selectedValue={generationTheme}
                        onValueChange={(value) => {
                            setGenerationTheme(value);
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item style={FONT.text} label="réaliste" value={"standard"} />
                        <Picker.Item style={FONT.text} label="humoristique" value={"humor"} />
                        <Picker.Item style={FONT.text} label="mixte" value={"mix"} />
                    </Picker>
                    {shapes.map((shape) => renderWithCheckmark(shape))}
                </View>
            </View>
        </GradientBackground>
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
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 20,
    },
    toggleLabel: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    picker: {
        height: 50,
        width: 150,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    choiceSelector: {
        marginTop: 20,
    },
    generateAnswersButtonView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20,
    },
});
