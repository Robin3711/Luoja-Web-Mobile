import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getGameInfos, restartGame } from '../utils/api';
import { toast } from '../utils/utils';
import { getThemeLabel, formatReadableDate } from '../utils/utils';
import { useNavigation } from '@react-navigation/native';

export default function HistoryQuizInformation({ partyId }) {
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [date, setDate] = useState("any");
    const [difficulty, setDifficulty] = useState("any");
    const [title, setTitle] = useState("any");
    const [nbQuestions, setNbQuestions] = useState(0);
    const [cursor, setCursor] = useState(0);
    const [buttonText, setButtonText] = useState('Continuer');

    const navigation = useNavigation();

    useEffect(() => {
        async function fetchParty() {
        try{
            const data = await getGameInfos(partyId);
            console.log(data);
            setLoading(false);
            setCursor(data.questionCursor);
            let scoreTemp = 0;
            for (let i = 0; i < data.results.length; i++) {
                if (data.results[i] === true) {
                    scoreTemp++;
                }
            }
            setScore(scoreTemp);
            let dateTemp = formatReadableDate(data.CreateDate);
            setDate(dateTemp);
            let difficultyTemp = data.Difficulty;
            if (difficultyTemp === "easy") {
                setDifficulty("Facile");
            } else if (difficultyTemp === "medium") {
                setDifficulty("Moyen");
            } else{
                setDifficulty("Difficile");
            }
            setDifficulty(difficultyTemp);
            setTitle(data.Title);
            setNbQuestions(data.numberOfQuestions);
            console.log(cursor, nbQuestions);
            if(data.numberOfQuestions === data.questionCursor){
                setButtonText('Rejouer');
            }
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', 'Erreur', error, 3000, 'crimson');
            }
        }
    }
        fetchParty();
    }, [partyId, cursor, nbQuestions]);

    const handleContinueGame = async() => {
        if (cursor === nbQuestions) {
            // on recrée une partie
            const newGameId = await restartGame(partyId);
            navigation.navigate('quizScreen', { gameId: newGameId.id });
        }
        else {
            // on continue la partie
            navigation.navigate('quizScreen', { gameId: partyId });
        }
    }

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    return (
        <View style={styles.historyQuizInformationView}>
            <View style={styles.historyPrincipalInformationsView}>
                <Text style={styles.titleText}>{title || `${partyId}`}</Text>
                <Text style={styles.titleText}>{difficulty}</Text>
                <Text style={styles.titleText}>{nbQuestions}</Text>
                <TouchableOpacity style={styles.touchableOpacity} onPress={handleContinueGame}>
                    <Text>{buttonText}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.historySecondaryInformationsView}>
                <Text style={styles.detailText}>Date : {date}</Text>
                <Text style={styles.detailText}>Score : {score}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    historyQuizInformationView: {
        marginBottom: 8, // Espacement entre les éléments
        padding: 12, // Espacement interne
        borderRadius: 8, // Coins arrondis
        borderColor: '#cccccc', // Bordure légère
        borderWidth: 1,
        shadowColor: '#000', // Ombre légère
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Ombre sur Android,
        backgroundColor: '#ffffff', // Fond blanc
    },
    historyPrincipalInformationsView: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8, // Espacement entre les éléments
        justifyContent: 'space-between',
    },
    historySecondaryInformationsView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    historyQuizInformationText: {
        fontSize: 14, // Taille plus petite pour correspondre
        color: '#333333', // Texte sombre
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4, // Espace sous le titre
        width: '15%'
    },
    detailText: {
        fontSize: 12,
        color: '#666666', // Texte secondaire plus clair
        width: '50%'
    },
    touchableOpacity: {
        backgroundColor: '#007bff', // Bleu Bootstrap
        padding: 8, // Espacement interne
        borderRadius: 4, // Coins arrondis
        width: 100, // Largeur fixe
        justifyContent: 'center', // Centrer le texte
        alignItems: 'center', // Centrer le texte
        height: 30, // Hauteur fixe
    }
});
