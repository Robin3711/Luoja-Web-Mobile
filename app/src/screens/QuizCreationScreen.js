import { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getQuizInfos } from '../utils/api';

import { publishQuiz, saveQuiz, editQuiz } from '../utils/api';
import { requireToken, toast } from '../utils/utils';
import DifficultyPicker from '../components/DifficultyPicker';
import { Edit2, LucideTrash } from 'lucide-react-native';
import ThemeSelector from '../components/ThemeList';

import { COLORS } from '../css/utils/color';
import { loadFont } from '../utils/utils';

const screenHeight = Dimensions.get('window').height;
const platform = Platform.OS;


export default function QuizCreation() {

    const navigation = useNavigation();
    const route = useRoute();

    const [quizId, setQuizId] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(null);
    const [difficulty, setDifficulty] = useState('easy');
    const [questions, setQuestions] = useState([]);

    const handleAddQuestions = (newQuestions) => {
        try {
            setQuestions([...questions, ...newQuestions]);
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
            }
        }
    }

    const handleUpdateQuestion = (question, index) => {
        try {
            const newQuestions = [...questions];
            newQuestions[index] = question[0];
            setQuestions(newQuestions);
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
            }
        }
    }

    const handleDeleteQuestion = (index) => {
        try {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }

        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
            }
        }
    }

    const handleClickRetrieveQuestions = async () => {
        try {
            navigation.navigate('retrieveQuestions', { handleAddQuestions });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
            }
        }
    };

    const handleClickCreateQuestion = async () => {
        try {
            navigation.navigate('createQuestion', { question: null, index: null, handleQuestion: handleAddQuestions });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
            }
        }
    }

    const handleClickEditQuestion = (question, index) => {
        try {
            navigation.navigate('createQuestion', { question, index, handleQuestion: handleUpdateQuestion });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
            }
        }
    }

    const handleSave = async () => {
        try {
            if (quizId === null) {
                const data = await saveQuiz(title, category, difficulty, questions);
                setQuizId(data.quizId);
            }
            else {
                await editQuiz(quizId, title, category, difficulty, questions);
            }
            toast('info', 'Le quiz à bien était sauvegardé !', "", 1000, 'dodgerblue');
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
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
            }
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
            }
        }
    }

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
            }
        }

        handleRetrieveQuiz();
    }
        , [route.params]);

    loadFont();
    return (
        <View style={styles.quizCreationView}>
            <Text style={styles.title}>Créez votre propre quiz !</Text>
            <View style={styles.quizCreationChildVIew}>
                <View style={styles.quizCreationLeftView}>
                    <View>
                        <Text style={styles.text}>Titre</Text>
                        <View style={styles.quizTitleView}>
                            <TextInput style={styles.quizTitleText} placeholder='Titre du quiz' value={title} onChangeText={setTitle} />
                        </View>
                        <Text style={styles.text}>Thème</Text>
                        <ThemeSelector onValueChange={setCategory} />
                        <Text style={styles.text}>Difficulté</Text>
                        <DifficultyPicker value={difficulty} onValueChange={setDifficulty} />
                        <View style={styles.quizCreationTopButtonsView}>
                            <TouchableOpacity style={styles.buttons} onPress={handleClickRetrieveQuestions}>
                                <Text style={styles.buttonText}>Récupérer des questions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={handleClickCreateQuestion}>
                                <Text style={styles.buttonText}>Rédiger une question</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <SafeAreaProvider style={{marginRight:'5%', height:'100%'}}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.quizCreationRightView}>
                                <Text style={styles.quizCreationQuestionsTitle}>Liste des questions :</Text>
                                <ScrollView
                                    contentContainerStyle={styles.questionsView}
                                    style={styles.scrollView}
                                >
                                    {
                                        questions.length !== 0 ?
                                            questions.map((question, index) => (
                                                <View style={styles.question} key={index}>
                                                    <Text style={{marginLeft: 5, color: COLORS.text.blue.dark}}>{question.text}</Text>
                                                    <View style={styles.quizButtonTouchable}>
                                                        <TouchableOpacity onPress={() => handleClickEditQuestion(question, index)}>
                                                            <Edit2 size={30} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDeleteQuestion(index)}>
                                                            <LucideTrash size={30} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ))
                                            : <Text>Aucune question</Text>
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </View>

            <View style={styles.quizCreationBottomButtonsView}>
                        <TouchableOpacity style={styles.buttons} onPress={handleSave}>
                            <Text style={styles.buttonText}>Enregistrer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={quizId === null ? styles.disabledButton : styles.buttons} onPress={handlePublish} disabled={quizId === null}>
                            <Text style={styles.buttonText}>Publier</Text>
                        </TouchableOpacity>
                    </View> 
        </View>
    );
}

const styles = StyleSheet.create({
    quizCreationView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#EEF8FF',
        flexDirection: 'column',
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
    },
    quizCreationTopButtonsView: {
        marginTop: '3%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10%',
    },
    quizCreationBottomButtonsView: {
        marginTop: '5%',
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
        height: '100%',
        marginRight: 200,
        maxHeight: screenHeight * 0.4,
    },
    questionsView: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
        flexGrow: 1,
        paddingBottom: 10,
    },
    scrollView: {
        backgroundColor: 'white',
        borderRadius: 20,
    },
    quizCreationQuestionsTitle: {
        coolor: COLORS.text.blue.dark,
        backgroundColor: 'white',
        padding: 5,
        marginBottom: 10,
        borderRadius: 20,
    },
    question: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        padding: 5,
        backgroundColor: COLORS.background.blue,
        borderRadius: 20,
    },
    buttons: {
        position: 'relative', // Permet de positionner le texte absolument par rapport au bouton
        backgroundColor: COLORS.button.blue.basic,
        height: 75,
        width: 350,
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 25,
        ...platform === 'web' ? { 
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
        } : { elevation: 2 },
    },
    disabledButton: {
        position: 'relative', // Permet de positionner le texte absolument par rapport au bouton
        backgroundColor: "#d3d3d3",
        height: 75,
        width: 350,
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 25,
        ...platform === 'web' ? { 
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