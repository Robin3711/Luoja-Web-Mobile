import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getPlatformStyle } from '../utils/utils';
import DifficultyRadioSelector from '../components/DifficultyRadioSelector';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { publishQuiz, saveQuiz } from '../utils/api';

const styles = getPlatformStyle();

export default function QuizCreation() {

    const navigation = useNavigation();

    const [quizId, setQuizId] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('none');
    const [difficulty, setDifficulty] = useState('easy');
    const [questions, setQuestions] = useState([]);

    const handleAddQuestions = (newQuestions) => {
        try{
            setQuestions([...questions, ...newQuestions]);
        }
        catch(error){
            alert(error.message);
        }
    }

    const handleRetrieveQuestions = async () => {
        try{
            navigation.navigate('retrieveQuestions', { handleAddQuestions });
        }
        catch(error){
            alert(error.message);
        }
    };

    const handleSave = async () => {
        try{
            console.log('title', title);
            console.log('category', category);
            console.log('difficulty', difficulty);
            console.log('questions', questions);
            const data = await saveQuiz(title, category, difficulty, questions);
            setQuizId(data.quizId);
        }
        catch(error){
            alert(error.message);
        }
    };
    
    const handlePublish = async () => {
        try{
            await publishQuiz(quizId);
        }
        catch(error){
            alert(error.message);
        }
    }

    return (
        <View style={styles.quizCreationView}>
            <View>
                <Text>Créez votre propre quiz !</Text>
            </View>
            <View style={styles.quizCreationChildVIew}>
                <View style={styles.quizCreationLeftView}>
                    <View>
                        <TextInput placeholder='Titre du quiz' onChangeText={setTitle}></TextInput>
                        <DifficultyRadioSelector value={difficulty} onValueChange={setDifficulty}/>
                        <TouchableOpacity onPress={handleRetrieveQuestions}>
                            <Text>Récupérer des questions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text>Rédiger une question</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.quizCreationBottomButtonsView}>
                        <TouchableOpacity onPress={handleSave}>
                            <Text>Enregistrer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePublish} disabled={quizId === null}>
                            <Text>Publier</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.quizCreationRightView}>
                    <Text>Liste des questions :</Text>
                    <View>
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