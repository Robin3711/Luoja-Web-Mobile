import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import { getRoomScores } from '../utils/api';

import { FONT } from '../css/utils/font';


const { width  , height} = Dimensions.get('window');
const isMobile = width< height



export default function EndScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    loadFont();

    const { roomId, gameMode } = route.params;

    const [scores, setScores] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const data = await getRoomScores(roomId);

                const scores = data.scores;

                setScores(scores);

                setLoading(false);
            } catch (err) {
                setError(true);
                setErrorMessage(err.status + " " + err.message);
            }
        };

        loadGameData();
    }, [roomId]);

    const handleReturnHome = async () => {
        navigation.navigate("initMenu");
    };

    return (error ? (
        <View style={styles.container}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate('initMenu')
            }
            }>
                <Text style={styles.buttonText}>Retour au menu</Text>
            </TouchableOpacity>
        </View>
    ) : (
        <View style={styles.container}>
            <View style={styles.parentContainer}>
                <Text style={[styles.title, {marginBottom:100}]}>Fin de partie !</Text>
                {scores !== null ? (
                    <ScrollView style={styles.scoreContainer}>
                        <Text style={styles.scoreTitle}>Scores :</Text>
                        <ScrollView style={styles.scoreContainer}>
                            {gameMode === "scrum" ? (
                                <View style={styles.scrumContainer}>
                                    {scores.map((score, index) => (
                                        <Text key={index} style={styles.text}>
                                            {score.userName} : {score.score}
                                        </Text>
                                    ))}
                                </View>
                            ) : (
                                <ScrollView horizontal style={styles.teamsContainer}>
                                    {scores.map((score, index) => (
                                        <View key={index} style={styles.team}>
                                            <Text style={FONT.subTitle}>
                                                {score.teamName} : {score.averageScore}
                                            </Text>
                                            <ScrollView style={styles.teamPlayersContainer}>
                                                {score.players.map((player, playerIndex) => (
                                                    <Text key={playerIndex} style={styles.text}>
                                                        {player.userName} : {player.score}
                                                    </Text>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </ScrollView>
                    </ScrollView>
                ) : (
                    <Text>Chargement du score...</Text>
                )}
            </View>

            <SimpleButton
                text="Retourner au menu"
                onPress={handleReturnHome}
            />
        </View>
    )
    );
}

const styles = StyleSheet.create({
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background.blue,
    },
    parentContainer: {
        alignItems: 'center',
        margin: 20,
        width: '100%',
    },
    scoreContainer: {
        maxHeight: 400,
        maxWidth: '100%',
        overflow: 'scroll',
        margin: 20,
        
    },
    scrumContainer: {
        flexDirection: 'column', // Les éléments sont empilés verticalement
        alignItems: 'center',   // Centrer horizontalement les éléments
        gap: 30,                // Espacement entre les éléments
        overflow: 'scroll',
    },
    teamsContainer: {
        maxWidth: '90vw',
        overflow: 'scroll',
        flexDirection: 'row',
        marginVertical: 20,
        paddingBottom: 20,
        height: 400,
    },
    team: {
        alignItems: 'center',
        margin: 10,
        borderWidth: 5,
        borderColor: COLORS.palette.blue.darker,
        borderRadius: 30,
        padding: 10,
        height: 270,
        minWidth: 200,
        backgroundColor: 'white',
    },
    teamPlayersContainer: {
        flexDirection: 'column',
        maxHeight: 150,
        overflow: 'scroll',
    },
    title: {
        top: 30,
        textAlign: 'center',
        color: COLORS.text.blue.dark,
        fontSize: 50,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        width: '100%',
        marginBottom: '25%',
    },
    text: {
        fontSize: 25,
        color: COLORS.text.blue.dark,
        overflow: 'scroll',
    },
    scoreTitle: {
        fontSize: 50,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});