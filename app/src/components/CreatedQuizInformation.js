import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getQuizAverage } from '../utils/api';

export default function CreatedQuizInformation({quizId, category, difficulty, date, status, title, nbQuestions}) {
    const [loading, setLoading] = useState(true);
    const [average, setAverage] = useState("aucune donnée");
    const [statusStr, setStatus] = useState("privé");
    const [nbPlayed, setNbPlayed] = useState(0);
    const [nbQuestionsStr, setNbQuestions] = useState("any");
    useEffect(() => {
        async function fetchParty() {
            setLoading(false);
            getQuizAverage(quizId).then((data) => {
                console.log(data);
                if (data.score === null){
                    data.score = "aucune donnée";
                } else {
                    setAverage(Math.trunc(data.score) + "%");
                    
                }
                setNbPlayed(data.nombreDePartie);
            });
            if(status === "true"){
                setStatus("public");
            }
            setNbQuestions(nbQuestions);
        }
        fetchParty();
    }, [category, status, quizId, date, nbQuestions]);

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    return (
        <View style={styles.QuizInformationView}>
            <View style={styles.PrincipalInformationsView}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.titleText}>{difficulty}</Text>
                <Text style={styles.titleText}>{nbQuestionsStr}</Text>
            </View>
            <View style={styles.SecondaryInformationsView}>
                <Text style={styles.detailText}>Joué {nbPlayed} fois</Text>
                <Text style={styles.detailText}>Réussite moyenne : {average}</Text>
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
});