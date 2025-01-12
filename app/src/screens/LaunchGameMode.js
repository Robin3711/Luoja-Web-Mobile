import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import ChoiseSelector from '../components/ChoicePicker';
import { useRoute } from '@react-navigation/native';
import { createGame, createRoom } from '../utils/api';


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
                toast('error', error.status, error.message, 3000, COLORS.toast.red);
            } else {
                toast('error', 'Erreur', error, 3000, COLORS.toast.red);
            }
        });
    }

    const handleStartRoom = (gameMode) => {
        switch (gameMode) {
            case "scrum":
                createRoom({ quizId: quizId, playerCount: playerCount, gameMode: gameMode }).then((room) => {
                    navigation.navigate('room', { roomId: room.id });
                });

                break;
            case "team":
                createRoom({ quizId: quizId, playerCount: playerCount, teams: ["Uno", "Dos"], gameMode: gameMode }).then((room) => {
                    navigation.navigate('room', { roomId: room.id });
                });

                break;
            default:
                break;
        }
    }

    return (
        <View style={styles.view}>
            <Text style={styles.pageTitle}>Choisissez un mode de jeu</Text>

            <SimpleButton text="Standard" onPress={() => handleStartQuiz()} />
            <SimpleButton text="Compte à rebourd" onPress={() => handleStartQuiz("timed")} />
            <ChoiseSelector value={timerDifficulty} onValueChange={setTimerDifficulty} defaultValue={true} />
            <ChoiseSelector value={scrumDifficulty} onValueChange={setScrumDifficulty} />

            <SimpleButton text="SCRUM" onPress={() => handleStartRoom("scrum")} />
            <TextInput
                placeholder="Nombre de joueurs"
                keyboardType="numeric"
                onChangeText={(text) => setPlayerCount(text)}
            />

            <SimpleButton text="TEAM" onPress={() => handleStartRoom("team")} />

        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: COLORS.background.blue,
    },
    pageTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 40,
        fontWeight: 'bold',
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