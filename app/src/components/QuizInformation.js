import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { cloneQuiz, saveQuiz } from '../utils/api';
import { getThemeLabel, toast, themeOptions } from '../utils/utils';
import { COLORS } from '../css/utils/color';

const platform = Platform.OS;

export default function QuizInformation({ quiz }) {
    const navigation = useNavigation();

    const handleLaunchGameMode = () => {
        navigation.navigate('launchGameMode', { quizId: quiz.id });
    }

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const getValueByLabel = (themeName) => {
        const theme = themeOptions.find(option => option.label === themeName);
        return theme ? theme.value : null; // Retourne la valeur correspondante ou null si non trouvée
    }


    const handleSave = async () => {
        try {
            const value = getValueByLabel(themeName);
            const questions = await cloneQuiz(quiz.id);
            await saveQuiz(quiz.title, value, quiz.difficulty, questions.questions);
            navigation.navigate('account');
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.red);
            }
        }
    };


    const themeName = getThemeLabel(parseInt(quiz.category));
    return (
        <View style={styles.QuizInformationView}>
            <Text style={[styles.QuizInformationText, { flex: 1.2 }]}>{truncateText(quiz.title, 20)}</Text>
            <Text style={[styles.QuizInformationText, { flex: 0.8 }]}>{themeName ?? "General Knowledge"}</Text>
            <Text style={[styles.QuizInformationText, { flex: 0.8 }]}>{quiz.difficulty}</Text>
            <TouchableOpacity style={styles.QuizInformationButton} onPress={handleSave}>
                <Text style={[{ color: COLORS.text.blue.light }]}>Cloner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.QuizInformationButton} onPress={handleLaunchGameMode}>
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