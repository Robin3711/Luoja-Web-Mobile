import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createParty } from '../utils/api';
import { getThemeLabel, toast } from '../utils/utils';
import { COLORS } from '../css/utils/color';

const platform = Platform.OS;

export default function QuizInformation({ quiz }) {
    navigation = useNavigation();
    const handleStartQuiz = () => {
        createParty(quiz.id).then((party) => {
            navigation.navigate('quizScreen', { gameId: party.id });
        }).catch((error) => {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', 'Erreur', error, 3000, 'crimson');
            }
        });
    }

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const themeName = getThemeLabel(parseInt(quiz.category));
    return (
        <View style={styles.QuizInformationView}>
            <Text style={[styles.QuizInformationText, { flex: 1.2 }]}>{truncateText(quiz.title, 20)}</Text>
            <Text style={[styles.QuizInformationText, { flex: 0.8 }]}>{themeName ?? "Thème général"}</Text>
            <Text style={[styles.QuizInformationText, { flex: 0.8 }]}>{quiz.difficulty}</Text>
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
        flex: platform === 'web' ? 0.3 : 0.6,
        backgroundColor: COLORS.button.blue.circle.normal,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        ...platform !== 'web' && { height: 40 },
    },
});