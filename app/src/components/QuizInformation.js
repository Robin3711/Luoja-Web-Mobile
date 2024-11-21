import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createParty } from '../utils/api';
import { getThemeName } from '../utils/utils';

export default function QuizInformation({quiz}) {
    navigation = useNavigation();
    const handleStartQuiz = () => {
        createParty(quiz.id).then((party) => {
            navigation.navigate('quizScreen', {quizId: party.id});
        });
    }
    console.log(quiz.category);
    const themeName = getThemeName(parseInt(quiz.category));
    return (
        <View style={styles.QuizInformationView}>
            <Text style={styles.QuizInformationText}>{quiz.title}</Text>
            <Text style={styles.QuizInformationText}>{themeName}</Text>
            <Text style={styles.QuizInformationText}>{quiz.difficulty}</Text>
            {/*<Text style={styles.QuizInformationText}>{quiz.questionCount}</Text>*/}
            <TouchableOpacity style={styles.QuizInformationButton} onPress={handleStartQuiz}>
                <Text>Jouer</Text>
            </TouchableOpacity> 
        </View>
    );
}