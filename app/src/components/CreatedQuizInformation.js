import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getQuizAverage } from '../utils/api';

export default function CreatedQuizInformation({quizId, category, difficulty, date, status, title, nbQuestions}) {
    const [loading, setLoading] = useState(true);
    const [average, setAverage] = useState("aucune donnée");
    const [nbPlayed, setNbPlayed] = useState(0);
    const [nbQuestionsStr, setNbQuestions] = useState("any");
    useEffect(() => {
        async function fetchParty() {
            setLoading(false);
            getQuizAverage(quizId).then((data) => {
                if (data.score === null){
                    data.score = "aucune donnée";
                } else {
                    setAverage(Math.trunc(data.score) + "%");
                    
                }
                setNbPlayed(data.nombreDePartie);
            });

            setNbQuestions(nbQuestions);
        }
        fetchParty();
    }, [category, status, quizId, date, nbQuestions]);

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    const isDraft = status === false;
    const containerStyle = [
        styles.QuizInformationView,
        isDraft && styles.draftQuiz, // Ajouter le style de brouillon si nécessaire
    ];
    const detailTextStyle = [
        styles.detailText,
        isDraft && styles.draftText, // Ajouter un texte grisé pour les brouillons
    ];

    return (
        <View style={styles.QuizInformationView}>
            <View style={styles.PrincipalInformationsView}>
                <Text style={[styles.titleText, isDraft && styles.draftText]}>{title}</Text>
                <Text style={[styles.titleText, isDraft && styles.draftText]}>{difficulty}</Text>
                <Text style={[styles.titleText, isDraft && styles.draftText]}>{nbQuestionsStr}</Text>
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
    },
    PrincipalInformationsView: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8, // Espacement entre les éléments
        justifyContent: 'space-around',
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
    },
    detailText: {
        fontSize: 12,
        color: '#666666', // Texte secondaire plus clair
    },
    draftQuiz: {
        borderColor: '#aaaaaa', // Bordure grise
        backgroundColor: '#f5f5f5', // Fond grisé
    },
    draftText: {
        color: '#aaaaaa', // Texte grisé
    },
});