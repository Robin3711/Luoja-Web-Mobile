import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { getGameInfos, createGame } from '../utils/api';
import { toast } from '../utils/utils';
import { formatReadableDate } from '../utils/utils';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../css/utils/color';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;

export default function HistoryQuizInformation({ partyId, quizId, onStatusChange }) {
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [date, setDate] = useState("any");
    const [difficulty, setDifficulty] = useState("any");
    const [title, setTitle] = useState("any");
    const [nbQuestions, setNbQuestions] = useState(0);
    const [cursor, setCursor] = useState(0);
    const [buttonText, setButtonText] = useState('Continuer');
    const [gameMode, setGameMode] = useState(null);
    const [gameDifficulty, setGameDifficulty] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        async function fetchParty() {
            try {
                const data = await getGameInfos(partyId);
                setLoading(false);
                setCursor(data.questionCursor);
                let scoreTemp = 0;
                for (let i = 0; i < data.results.length; i++) {
                    if (data.results[i] === true) {
                        scoreTemp++;
                    }
                }
                setGameMode(data.gameMode);
                setScore(scoreTemp);
                let dateTemp = formatReadableDate(data.CreateDate);
                setDate(dateTemp);
                setGameDifficulty(data.gameDifficulty)
                setDifficulty(data.quizDifficulty);
                setTitle(data.Title);
                setNbQuestions(data.numberOfQuestions);
                const status = data.numberOfQuestions === data.questionCursor ? 'Rejouer' : 'Continuer';
                setButtonText(status);

                onStatusChange(partyId, status, data.Title);
            }
            catch (error) {
                if (error.status && error.message) {
                    toast('error', error.status, error.message, 3000, COLORS.toast.red);
                } else {
                    toast('error', 'Erreur', error, 3000, COLORS.toast.red);
                }
            }
        }
        fetchParty();
    }, [partyId, cursor, nbQuestions]);

    const handleContinueGame = async () => {
        if (cursor === nbQuestions) {
            // on recrée une partie
            createGame(quizId, gameMode, gameDifficulty).then((game) => {
                navigation.navigate('quizScreen', { gameId: game.id, gameMode: gameMode });
            }).catch((error) => {
                if (error.status && error.message) {
                    toast('error', error.status, error.message, 3000, COLORS.toast.red);
                } else {
                    toast('error', 'Erreur', error, 3000, COLORS.toast.red);
                }
            });
        }
        else {
            // on continue la partie
            navigation.navigate('quizScreen', { gameId: partyId, gameMode: gameMode });
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
                <Text style={styles.titleText}>{gameMode !== null ? gameDifficulty + ' ' + gameMode : 'Default'}</Text>
                <TouchableOpacity style={[styles.touchableOpacity, { backgroundColor: buttonText === 'Rejouer' ? COLORS.button.blue.darkBasic : COLORS.button.blue.basic }]} onPress={handleContinueGame}>
                    <Text>{buttonText}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.historySecondaryInformationsView}>
                <Text style={styles.detailText}>Score : {score}</Text>
                <Text style={styles.detailText}>Date : {date}</Text>
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
        justifyContent: 'space-between',
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
        padding: !isMobile ? 8 : 0, // Espacement interne
        borderRadius: 4, // Coins arrondis
        width: 100, // Largeur fixe
        justifyContent: 'center', // Centrer le texte
        alignItems: 'center', // Centrer le texte
        height: 30, // Hauteur fixe
    }
});