import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { cloneQuiz, saveQuiz } from '../utils/api';
import { getThemeLabel, toast, themeOptions } from '../utils/utils';
import { COLORS } from '../css/utils/color';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;

export default function QuizInformation({ quiz }) {
    const navigation = useNavigation();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleLaunchGameMode = () => {
        navigation.navigate('launchGameMode', { quizId: quiz.id });
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const getValueByLabel = (themeName) => {
        const theme = themeOptions.find(option => option.label === themeName);
        return theme ? theme.value : null;
    };

    const handleSave = async () => {
        try {
            const value = getValueByLabel(themeName);
            const questions = await cloneQuiz(quiz.id);
            await saveQuiz(quiz.title, value, quiz.difficulty, questions.questions);
            navigation.navigate('account');
        } catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    };

    const themeName = getThemeLabel(parseInt(quiz.category));
    return (
        <View style={styles.QuizInformationView}>
            <Pressable
                onPressIn={() => setShowTooltip(true)}
                onPressOut={() => setShowTooltip(false)}
                {...(Platform.OS === 'web'
                    ? {
                        onMouseEnter: () => setShowTooltip(true),
                        onMouseLeave: () => setShowTooltip(false),
                    }
                    : {})}
                style={isMobile ? styles.tooltipContainer : { zIndex: 9999, position: 'relative' }}
            >
                <Text style={[styles.QuizInformationText, { flex: 0.8 }]}>
                    {truncateText(quiz.title, isMobile ? 15 : 20)}
                </Text>
                {showTooltip && (
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>{quiz.title}</Text>
                    </View>
                )}
            </Pressable>

            <Text style={[styles.QuizInformationText, { flex: isMobile ? 0.8 : 0.8 }]}>{themeName ?? "General Knowledge"}</Text>

            <Text style={[styles.QuizInformationText, { flex: 0.8 }]}>{quiz.difficulty}</Text>
            {isMobile ? (
                <View style={styles.mobilePlayView}>
                    <TouchableOpacity style={styles.touchableOpacity} onPress={handleSave}>
                        <Text style={[{ color: COLORS.text.blue.light }]}>Cloner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchableOpacity} onPress={handleLaunchGameMode}>
                        <Text style={[{ color: COLORS.text.blue.light }]}>Jouer</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <TouchableOpacity style={styles.touchableOpacity} onPress={handleSave}>
                        <Text style={[{ color: COLORS.text.blue.light }]}>Cloner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchableOpacity} onPress={handleLaunchGameMode}>
                        <Text style={[{ color: COLORS.text.blue.light }]}>Jouer</Text>
                    </TouchableOpacity>
                </>

            )}

        </View>
    );
}

const styles = StyleSheet.create({
    QuizInformationView: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: isMobile ? 70 : 70,
        borderRadius: 10,
        marginVertical: 10,
        padding: isMobile ? 5 : 10,
        marginBottom: 10,
        top: isMobile ? -5 : -10,
        overflow: 'visible',
        gap: 5,
    },
    QuizInformationText: {
        fontSize: isMobile ? 12 : 17,
        minWidth: isMobile ? 0 : 150,
        textAlign: 'center',
    },
    tooltipContainer: {
        position: 'relative',
        flex: 1,
        zIndex: 9999,
    },
    tooltip: {
        position: 'absolute',
        top: !isMobile ? -40 : -50,
        left: isMobile ? '25%' : 45,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        zIndex: 9999, // Assurez-vous que la tooltip est bien au-dessus
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10, // Assure une priorité visuelle sur Android
        width: isMobile ? 200 : 250,
    },

    tooltipText: {
        color: COLORS.text.white,
        fontSize: isMobile ? 12 : 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    touchableOpacity: {
        padding: !isMobile ? 8 : 0,
        backgroundColor: COLORS.button.blue.circle.normal,
        borderRadius: 10,
        width: isMobile ? 60 : 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: isMobile ? 30 : 40,
        marginHorizontal: 5,
        marginTop: 5,
        top: isMobile ? -5 : 0,
    },
    mobilePlayView: {

    }
});
