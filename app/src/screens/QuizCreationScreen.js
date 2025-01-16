import { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getQuizInfos } from '../utils/api';
import DragList from 'react-native-draglist';

import { publishQuiz, saveQuiz, editQuiz } from '../utils/api';
import { requireToken, toast } from '../utils/utils';
import ChoicePicker from '../components/ChoicePicker';
import { Edit2, GripVertical, LucideTrash } from 'lucide-react-native';
import ThemeSelector from '../components/ThemeList';

import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';

import GradientBackground from '../css/utils/linearGradient';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;

export default function QuizCreation() {

    const navigation = useNavigation();
    const route = useRoute();

    const [quizId, setQuizId] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(null);
    const [difficulty, setDifficulty] = useState('easy');
    const [questions, setQuestions] = useState([]);
    const [saveButton, setSaveButton] = useState(true);
    const [publishButton, setPublishButton] = useState(true);
    const [resetForm, setResetForm] = useState(true);

    const handleAddQuestions = (newQuestions) => {
        try {
            setQuestions([...questions, ...newQuestions]);
            setSaveButton(false);
            setResetForm(false);
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    }

    const handleUpdateQuestion = (question, index) => {
        try {
            const newQuestions = [...questions];
            newQuestions[index] = question[0];
            setQuestions(newQuestions);
            setSaveButton(false);
            setResetForm(false);
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    }

    const handleDeleteQuestion = (index) => {
        try {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
            setSaveButton(false);
            setResetForm(false);
        }

        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    }

    const handleClickRetrieveQuestions = async () => {
        try {
            navigation.navigate('retrieveQuestions', { handleAddQuestions });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    };

    const handleClickCreateQuestion = async () => {
        try {
            navigation.navigate('createQuestion', { question: null, index: null, handleQuestion: handleAddQuestions });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    }

    const handleClickEditQuestion = (question, index) => {
        try {
            navigation.navigate('createQuestion', { question, index, handleQuestion: handleUpdateQuestion });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    }

    const handleSave = async () => {
        try {
            if (quizId === null) {
                const data = await saveQuiz(title, category, difficulty, questions);
                setQuizId(data.quizId);

                if (!isMobile) {
                    navigation.navigate('quizCreation', { quizId: data.quizId });
                }
            }
            else {
                await editQuiz(quizId, title, category, difficulty, questions);
            }
            setPublishButton(false);
            setSaveButton(true);
            setResetForm(false);
            toast('info', 'Le quiz à bien était sauvegardé !', "", 1000, COLORS.toast.text.blue);
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    };

    const handlePublish = async () => {
        try {
            if (title === '') {
                throw new Error("Le titre du quiz ne peut pas être vide.");
            } else if (questions.length === 0) {
                throw new Error("Aucune question n'a été ajoutée au quiz.");
            } else {
                await handleSave();
                await publishQuiz(quizId);

                setQuizId(null);
                setTitle('');
                setCategory(null);
                setDifficulty('easy');
                setQuestions([]);
                navigation.navigate('account');
            }
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    }

    const handleReset = () => {
        // Réinitialisation des états du formulaire
        setQuizId(null);
        setTitle('');
        setCategory(null);
        setDifficulty('easy');
        setQuestions([]);
        setPublishButton(true);
        setSaveButton(true)
        setResetForm(true);

        // Modification de l'URL pour supprimer les paramètres
        if (!isMobile) {
            navigation.navigate('quizCreation');
        }

        toast('info', 'Le formulaire a été réinitialisé.', '', 1000, COLORS.toast.text.blue);
    };

    // Vérification du token à chaque fois que l'écran est focus
    useFocusEffect(
        useCallback(() => {
            requireToken(navigation);
        }, [])
    );

    useEffect(() => {
        const handleRetrieveQuiz = async () => {
            if (route.params !== undefined) {
                const data = await getQuizInfos(route.params.quizId);
                const quiz = data.quiz;

                setQuizId(route.params.quizId);
                setTitle(quiz.title);
                setCategory(quiz.category);
                setDifficulty(quiz.difficulty);
                setQuestions(quiz.questions);
                setResetForm(false);
            }
        }
        handleRetrieveQuiz();
    }, [route.params]);

    useEffect(() => {
        if (title !== '' || category !== null || difficulty !== 'easy') {
            setSaveButton(false);
            setResetForm(false);
        } else {
            setSaveButton(true);
            setResetForm(true);
        }
    }, [title, category, difficulty]);

    useEffect(() => {
        setSaveButton(true);
        if (quizId) {
            setPublishButton(false);
        } else {
            setPublishButton(true);
        }
    }, [quizId]);

    // Fonction pour extraire les clés
    const keyExtractor = (item, index) => item.id || index.toString();

    // Fonction pour réorganiser les questions
    const handleReordered = (fromIndex, toIndex) => {
        const updatedQuestions = [...questions];
        const [movedItem] = updatedQuestions.splice(fromIndex, 1);
        updatedQuestions.splice(toIndex, 0, movedItem);
        setQuestions(updatedQuestions);
        setSaveButton(false);
        setResetForm(false);
    };

    // Fonction pour rendre les items de la liste
    const renderQuestionItem = ({ item, index, onDragStart, isActive }) => {
        return (
            <View
                key={item.id}
                style={[styles.question, isActive ? { backgroundColor: '#D3EFFF' } : {}]}
            >
                <Text style={{ marginLeft: 5, color: COLORS.text.blue.dark }}>{item.text}</Text>
                <View style={styles.quizButtonTouchable}>
                    <TouchableOpacity onPress={() => handleClickEditQuestion(item, index)}>
                        <Edit2 size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteQuestion(index)}>
                        <LucideTrash size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15 }} onPressIn={onDragStart}>
                        <GripVertical size={30} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <GradientBackground>
            <View style={styles.quizCreationView}>
                <Text style={styles.title}>Créez votre propre quiz !</Text>
                <View style={styles.quizCreationChildVIew}>
                    <View style={styles.quizCreationLeftView}>
                        <Text style={styles.text}>Titre</Text>
                        <View style={styles.quizTitleView}>
                            <TextInput style={styles.quizTitleText} placeholder='Titre du quiz' value={title} onChangeText={setTitle} />
                        </View>
                        <Text style={styles.text}>Thème</Text>
                        <ThemeSelector onValueChange={setCategory} />
                        <Text style={styles.text}>Difficulté</Text>
                        <ChoicePicker value={difficulty} onValueChange={setDifficulty} />
                        <View style={styles.quizCreationTopButtonsView}>
                            <TouchableOpacity style={styles.buttons} onPress={handleClickRetrieveQuestions}>
                                <Text style={FONT.button}>Importer des questions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={handleClickCreateQuestion}>
                                <Text style={FONT.button}>Créer une question</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <SafeAreaProvider style={{ marginRight: '5%', height: '100%' }}>
                        <SafeAreaView>
                            <View style={styles.quizCreationRightView}>
                                <Text style={styles.quizCreationQuestionsTitle}>Liste des questions :</Text>
                                <DragList
                                    data={questions}
                                    keyExtractor={keyExtractor}
                                    onReordered={handleReordered}
                                    renderItem={renderQuestionItem}
                                    containerStyle={styles.dragListContainer}
                                />
                            </View>
                        </SafeAreaView>
                    </SafeAreaProvider>
                </View>

                <View style={styles.quizCreationBottomButtonsView}>
                    <TouchableOpacity style={saveButton ? styles.disabledButton : styles.buttons} onPress={handleSave} disabled={saveButton}>
                        <Text style={FONT.button}>Enregistrer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={publishButton ? styles.disabledButton : styles.buttons} onPress={handlePublish} disabled={publishButton}>
                        <Text style={FONT.button}>Publier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={resetForm ? styles.disabledButton : styles.buttons} onPress={handleReset} disabled={resetForm}>
                        <Text style={FONT.button}>{!quizId ? "Réinitialiser" : "Nouveau quiz"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    quizCreationView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
        top: -50
    },
    title: {
        marginTop: '3%',
        marginBottom: '5%',
        textAlign: 'center',
        color: COLORS.text.blue.dark,
        fontSize: 50,
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    text: {
        fontSize: 20,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        marginTop: 5,
        color: COLORS.text.blue.dark,
    },
    quizCreationChildVIew: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    quizTitleView: {
        backgroundColor: '#58bdfe',
        width: '100%',
        padding: 10,
        borderRadius: 20,
    },
    quizTitleText: {
        padding: 5,
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
    },
    quizCreationLeftView: {
        width: '40%',
        marginRight: '10%',
        marginLeft: '5%',
        maxHeight: '62vh',
    },
    quizCreationTopButtonsView: {
        marginTop: '3vh',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10%',
    },
    quizCreationBottomButtonsView: {
        marginTop: '2vh',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '10%',
    },
    quizCreationRightView: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#8fd3ff',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxHeight: '45vh',
        marginRight: 200,
        flex: 1,
    },
    dragListContainer: {
        maxHeight: '35vh',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
    },
    quizCreationQuestionsTitle: {
        coolor: COLORS.text.blue.dark,
        backgroundColor: 'white',
        fontFamily: 'LobsterTwo_400Regular',
        fontSize: 20,
        padding: 5,
        marginBottom: 10,
        borderRadius: 20,
    },
    question: {
        display: 'flex',
        flexGrow: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        padding: 5,
        backgroundColor: COLORS.background.blue,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttons: {
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: COLORS.button.blue.basic,
        height: 75,
        width: 350,
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 25,
        ...!isMobile ? {
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
        } : { elevation: 2 },
    },
    disabledButton: {
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: "#d3d3d3",
        height: 75,
        width: 350,
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 25,
        ...!isMobile ? {
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
        } : { elevation: 2 },
    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: COLORS.text.blue.dark,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'LobsterTwo_700Bold',
        marginVertical: 20,
    },
    quizButtonTouchable: {
        flexDirection: 'row',
    }
});