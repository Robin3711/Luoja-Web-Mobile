import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createParty } from '../utils/api';
import { getThemeLabel, toast } from '../utils/utils';
import Toast from 'react-native-toast-message';


export default function QuizInformation({ quiz }) {
    navigation = useNavigation();
    const handleStartQuiz = () => {
        createParty(quiz.id).then((party) => {
            navigation.navigate('quizScreen', { gameId: party.id });
        }).catch((error) => {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'red');
            } else {
                toast('error', 'Erreur', error, 3000, 'red');
            }
        });
    }
    console.log(quiz.category);
    const themeName = getThemeLabel(parseInt(quiz.category));
    return (
        <View style={styles.QuizInformationView}>
            <Toast />
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

const styles = StyleSheet.create({
});