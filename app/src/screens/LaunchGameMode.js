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
    const [difficulty, setDifficulty] = useState("easy");
    const [playerCount, setPlayerCount] = useState("");

    const handleStartQuiz = (gameMode) => {
        createGame(quizId, gameMode, difficulty).then((game) => {
            navigation.navigate('quizScreen', { gameId: game.id, gameMode: gameMode });
        }).catch((error) => {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', 'Erreur', error, 3000, 'crimson');
            }
        });
    }

    const handleStartRoom = () => {
        createRoom(quizId, playerCount).then((room) => {
            navigation.navigate('room', { roomId: room.id });
        });
    }

    return (
        <View style={styles.view}>
            <Text style={styles.pageTitle}>Choisissez un mode de jeu</Text>

            <SimpleButton text="Standard" onPress={() => handleStartQuiz()} />
            <SimpleButton text="Compte à rebourd" onPress={() => handleStartQuiz("timed")} />
            <ChoiseSelector value={difficulty} onValueChange={setDifficulty} />

            <SimpleButton text="SCRUM" onPress={() => handleStartRoom("scrum")} />
            <TextInput
                    placeholder="Nombre de joueurs"
                    keyboardType="numeric"
                    onChangeText={(text) => setPlayerCount(text)}
                />

            <SimpleButton text="TEAM" onPress={() => handleStartQuiz("team")} />
        
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