import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import ChoiseSelector from '../components/ChoicePicker';
import { useRoute } from '@react-navigation/native';
import { createGame, createRoom } from '../utils/api';
import Grid from 'react-native-grid-component';

import { FONT } from '../css/utils/font';

export default function LaunchGameMode() {

    const navigation = useNavigation();
    const route = useRoute();

    const quizId = route.params.quizId;
    const [timerDifficulty, setTimerDifficulty] = useState("easy");
    const [scrumDifficulty, setScrumDifficulty] = useState("easy");
    const [playerCount, setPlayerCount] = useState("");

    const handleStartQuiz = (gameMode) => {
        createGame(quizId, gameMode, gameMode === "timed" ? timerDifficulty : scrumDifficulty).then((game) => {
            navigation.navigate('quizScreen', { gameId: game.id, gameMode: gameMode });
        }).catch((error) => {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', 'Erreur', error, 3000, 'crimson');
            }
        });
    }

    const handleStartRoom = (gameMode) => {
        switch (gameMode) {
            case "scrum":
                createRoom({quizId: quizId, playerCount: playerCount, gameMode: gameMode}).then((room) => {
                    navigation.navigate('room', { roomId: room.id });
                });

                break;
            case "team":
                createRoom({quizId: quizId,playerCount: playerCount, teams: ["Uno","Dos"], gameMode: gameMode}).then((room) => {
                    navigation.navigate('room', { roomId: room.id });
                });

                break;
            default:
                break;
            }
    }

    const renderItem = (item, index) => (
        <View style={styles.gridItem}>
            {item}
        </View>
    );

    return (
        <View style={styles.view}>
            <Text style={FONT.title}>Choisissez un mode de jeu</Text>
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
                <Grid
                    style={styles.grid}
                    renderItem={renderItem}
                    data={[
                        <>
                            <SimpleButton text="Standard" onPress={() => handleStartQuiz()} />
                            <Text style={FONT.paragraphe}>Le joueur dispose d’un temps illimité pour répondre à chaque question.</Text>
                        </>,
                        <>
                            <SimpleButton text="SCRUM" onPress={() => handleStartRoom("scrum")} />
                            <Text style={FONT.paragraphe}>Le joueur dispose d’un temps limité pour répondre à chaque question : 30s (facile), 15s (moyen), ou 5s (difficile).</Text>
                        </>,
                        <>
                            <SimpleButton text="Compte à rebourd" onPress={() => handleStartQuiz("timed")} />
                            <Text style={FONT.paragraphe}>Plusieurs joueurs jouent simultanément au même quiz. Le premier à répondre correctement gagne les points et déclenche la question suivante. Chaque joueur ne peut répondre qu'une fois par question.</Text>
                            <ChoiseSelector value={timerDifficulty} onValueChange={setTimerDifficulty} defaultValue={true} />
                        </>,

                        <>
                            <SimpleButton text="TEAM" onPress={() => handleStartQuiz("team")} />
                            <Text style={FONT.paragraphe}>Les joueurs forment des équipes et répondent aux questions avec un temps limité, configurable par niveau de difficulté. Le score final de chaque équipe est la moyenne des scores de ses membres.</Text>
                            <TextInput
                                placeholder="Nombre de joueurs"
                                keyboardType="numeric"
                                onChangeText={(text) => setPlayerCount(text)}
                            />
                            <ChoiseSelector value={timerDifficulty} onValueChange={setTimerDifficulty/*TODO: a modifier*/} defaultValue={true} /> 
                        </>
                    ]}
                    itemsPerRow={2}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: COLORS.background.blue,
        width: '100%',
        height: '100%',
    },
    pageTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    grid: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gridItem: {
        flex: 1,
        margin: 10,
        padding: 25,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 5,
        borderColor: COLORS.palette.blue.normal, // Appliquer la couleur de la bordure
    },
    inputTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    loginInput: {
        height: 40,
        width: 250,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'white',
    },
    nameInputView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#58bdfe',
    },
    passwordInputView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        borderRadius: 20,
        backgroundColor: '#4d65b4',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8fd3ff',
        height: 50,
        width: 250,
        borderRadius: 15,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});