import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { createGame, getQuizAverage } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import { toast } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import SimpleButton from './SimpleButton';
import { FONT } from '../css/utils/font';

export default function CreatedQuizInformation({ quizId, category, difficulty, date, status, title, nbQuestions }) {
    const [loading, setLoading] = useState(true);
    const [average, setAverage] = useState("aucune donnée");
    const [nbPlayed, setNbPlayed] = useState(0);
    const [nbQuestionsStr, setNbQuestions] = useState("any");

    const navigation = useNavigation();

    useEffect(() => {
        async function fetchParty() {
            setLoading(false);

            getQuizAverage(quizId).then((data) => {
                if (data.score === null) {
                    data.score = "aucune donnée";
                } else {
                    setAverage(Math.trunc(data.score) + "%");
                }
                setNbPlayed(data.nombreDePartie);
            }).catch((error) => {
                if (error.status && error.message) {
                    toast('error', error.status, error.message, 3000, 'crimson');
                } else {
                    toast('error', 'Erreur', error, 3000, 'crimson');
                }
            });

            setNbQuestions(nbQuestions);
        }
        fetchParty();
    }, [category, status, quizId, date, nbQuestions]);

    if (loading) {
        return <Text style={FONT.button}>Chargement...</Text>;
    }

    const isDraft = status === false;

    const detailTextStyle = [
        styles.detailText,
        isDraft && styles.draftText, // Ajouter un texte grisé pour les brouillons
    ];

    const handleCreationQuiz = () => {
        if (status === false && Platform.OS === 'web') {
            navigation.navigate('quizCreation', { quizId: quizId });
        }
    };

    const handlePlayQuiz = async () => {
        if (status === true && Platform.OS === 'web') {
            const data = await createGame(quizId);
            navigation.navigate('quizScreen', { gameId: data.id });
        }
    };

    if (status === false && Platform.OS === 'web') {
        return (
            <View style={styles.QuizInformationView}>
                <View style={styles.PrincipalInformationsView}>
                    <Text style={[styles.titleText, isDraft && styles.draftText]}>{title}</Text>
                    <Text style={[styles.titleText, isDraft && styles.draftText]}>{difficulty}</Text>
                    <Text style={[styles.titleText, isDraft && styles.draftText]}>{nbQuestionsStr}</Text>
                    <SimpleButton 
                        text="Modifier" 
                        onPress={handleCreationQuiz} 
                        color={COLORS.button.blue.basic} 
                        height={30}
                        width={100}
                        textStyle={{ fontSize: 20 }}
                    />
                </View>
                <View style={styles.SecondaryInformationsView}>
                    <Text style={detailTextStyle}>{isDraft ? "Brouillon" : `Joué ${nbPlayed} fois`}</Text>
                    <Text style={detailTextStyle}>{isDraft ? "" : `Réussite moyenne : ${average}`}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.QuizInformationView}>
            <View style={styles.PrincipalInformationsView}>
                <Text style={[styles.titleText, isDraft && styles.draftText]}>{title}</Text>
                <Text style={[styles.titleText, isDraft && styles.draftText]}>{difficulty}</Text>
                <Text style={[styles.titleText, isDraft && styles.draftText]}>{nbQuestionsStr}</Text>
                <SimpleButton 
                    text="Jouer" 
                    onPress={handlePlayQuiz} 
                    color={COLORS.button.blue.darkBasic} 
                    height={30}
                    width={100}
                    textStyle={{ fontSize: 20 }}
                />
            </View>
            <View style={styles.SecondaryInformationsView}>
                <Text style={detailTextStyle}>{isDraft ? "Brouillon" : `Joué ${nbPlayed} fois`}</Text>
                <Text style={detailTextStyle}>{isDraft ? "" : `Réussite moyenne : ${average}`}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    QuizInformationView: {
        marginBottom: 8, // Espacement entre les éléments
        padding: 12, // Espacement interne
        borderRadius: 8, // Coins arrondis
        borderColor: '#cccccc', // Bordure légère
        borderWidth: 1,
        shadowColor: '#000', // Ombre légère
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Ombre sur Android
        backgroundColor: 'white',
    },
    PrincipalInformationsView: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8, // Espacement entre les éléments
        justifyContent: 'space-between',
    },
    SecondaryInformationsView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4, // Espace sous le titre
        width: '15%',
    },
    detailText: {
        fontSize: 12,
        color: '#666666', // Texte secondaire plus clair
        width: '40%',
    },
    draftQuiz: {
        borderColor: '#aaaaaa', // Bordure grise
        backgroundColor: '#f5f5f5', // Fond grisé
    },
    draftText: {
        color: '#aaaaaa', // Texte grisé
    },
    touchableOpacity: {
        padding: 8, // Espacement interne
        borderRadius: 4, // Coins arrondis
        width: 100, // Largeur fixe
        justifyContent: 'center', // Centrer le texte
        alignItems: 'center', // Centrer le texte
        height: 30, // Hauteur fixe
    }
});