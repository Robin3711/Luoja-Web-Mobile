import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createParty } from '../utils/api';

export default function QuizInformation({quiz}) {
    navigation = useNavigation();
    const handleStartQuiz = () => {
        createParty(quiz.id).then((party) => {
            navigation.navigate('quizScreen', {quizId: party.id});
        });
    }
    return (
        <View style={styles.QuizInformationView}>
            <Text style={styles.QuizInformationText}>{quiz.title}</Text>
            <Text style={styles.QuizInformationText}>{quiz.category}</Text>
            <Text style={styles.QuizInformationText}>{quiz.difficulty}</Text>
            {/*<Text style={styles.QuizInformationText}>{quiz.questionCount}</Text>*/}
            <TouchableOpacity style={styles.QuizInformationButton} onPress={handleStartQuiz}>
                <Text>Jouer</Text>
            </TouchableOpacity> 
        </View>
    );
}