import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createParty } from '../utils/api';
import { getThemeLabel } from '../utils/utils';
import { COLORS } from '../css/utils/color';

export default function QuizInformation({ quiz }) {
    navigation = useNavigation();
    const handleStartQuiz = () => {
        createParty(quiz.id).then((party) => {
            navigation.navigate('quizScreen', { gameId: party.id });
        });
    }

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    console.log(quiz.category);
    const themeName = getThemeLabel(parseInt(quiz.category));
    return (
        <View style={styles.QuizInformationView}>
            <Text style={[styles.QuizInformationText, {flex:1.2}]}>{truncateText(quiz.title, 20)}</Text>
            <Text style={[styles.QuizInformationText, {flex:0.8}]}>{themeName ?? "Thème général"}</Text>
            <Text style={[styles.QuizInformationText, {flex:0.8}]}>{quiz.difficulty}</Text>
            <TouchableOpacity style={styles.QuizInformationButton} onPress={handleStartQuiz}>
                <Text style={[{ color: COLORS.text.blue.light }]}>Jouer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    QuizInformationView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
    },
    QuizInformationText: {
        flex: 1,
        fontSize: 20,
        },
    QuizInformationButton: {
        flex: 0.30,
        backgroundColor: COLORS.button.blue.circle.normal,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
});