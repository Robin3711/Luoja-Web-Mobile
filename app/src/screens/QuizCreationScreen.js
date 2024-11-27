import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { publishQuiz, saveQuiz, editQuiz } from '../utils/api';
import DifficultyPicker from '../components/DifficultyPicker';



export default function QuizCreation() {

    const navigation = useNavigation();

    const [quizId, setQuizId] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('none');
    const [difficulty, setDifficulty] = useState('easy');
    const [questions, setQuestions] = useState([]);

    const handleAddQuestions = (newQuestions) => {
        try {
            setQuestions([...questions, ...newQuestions]);
        }
        catch (error) {
            alert(error.message);
        }
    }

    const handleRetrieveQuestions = async () => {
        try {
            navigation.navigate('retrieveQuestions', { handleAddQuestions });
        }
        catch (error) {
            alert(error.message);
        }
    };

    const handleCreateQuestion = async () => {
        try {
            navigation.navigate('createQuestion', {handleAddQuestions});
        }
        catch (error) {
            alert(error.message);
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
        }
        catch (error) {
            alert(error.message);
        }
    };

    const handlePublish = async () => {
        try {
            console.log(questions);
            await editQuiz(quizId, title, category, difficulty, questions);
            await publishQuiz(quizId);

            setQuizId(null);
            setTitle('');
            setCategory('none');
            setDifficulty('easy');
            setQuestions([]);
        }
        catch (error) {
            alert(error.message);
        }
    }

    return (
        <View style={styles.quizCreationView}>
            <Text style={styles.titleText}>Créez votre propre quiz !</Text>
            <View style={styles.quizCreationChildVIew}>
                <View style={styles.quizCreationLeftView}>
                    <View>
                        <View style={styles.quizTitleView}>
                            <TextInput style={styles.quizTitleText} placeholder='Titre du quiz' value={title} onChangeText={setTitle} />
                        </View>
                        <DifficultyPicker value={difficulty} onValueChange={setDifficulty} />
                        <View style={styles.quizCreationTopButtonsView}>
                            <TouchableOpacity style={styles.buttons} onPress={handleRetrieveQuestions}>
                                <Text style={styles.buttonText}>Récupérer des questions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={handleCreateQuestion}>
                                <Text style={styles.buttonText}>Rédiger une question</Text>
                        </TouchableOpacity>
                        </View>
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

                <View style={styles.quizCreationRightView}>
                    <Text style={styles.quizCreationQuestionsTitle}>Liste des questions :</Text>
                    <View style={styles.questionsView}>
                        {
                            questions.length !== 0 ?
                                questions.map((question, index) => (
                                    <View key={index}>
                                        <Text>{question.question}</Text>
                                    </View>
                                ))
                                : <Text>Aucune question</Text>
                        }
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    quizCreationView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText:{
        position: 'absolute',
        top: 20,
        fontSize: 40,
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
    },
    quizCreationTopButtonsView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quizCreationBottomButtonsView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    quizCreationRightView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#8fd3ff',
        height: '100%',
        borderRadius: 20,
        padding: 20,
        width: '40%',
    },
    quizCreationQuestionsTitle: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
    },
    questionsView: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
        height: '80%'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8fd3ff',
        height: 50,
        width: 250,
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 10,
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    disabledButton: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
        height: 50,
        width: 250,
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 10,
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
      },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});