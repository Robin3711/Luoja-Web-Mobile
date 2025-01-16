import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import ChoiseSelector from '../components/ChoicePicker';
import { createGame, createRoom } from '../utils/api';
import { toast } from '../utils/utils';
import { FONT } from '../css/utils/font';
import GradientBackground from '../css/utils/linearGradient';
import { G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const isMobile = width < height

export default function LaunchGameMode() {
    const navigation = useNavigation();
    const route = useRoute();

    const quizId = route.params.quizId;
    const [timerDifficulty, setTimerDifficulty] = useState("easy");
    const [roomTimerDifficulty, setRoomTimerDifficulty] = useState("easy");
    const [scrumPlayerCount, setScrumPlayerCount] = useState("");
    const [teamCount, setTeamCount] = useState("");
    const [teams, setTeams] = useState([]);
    const [disable, setDisable] = useState(false);


    const handleStartQuiz = (gameMode) => {
        setDisable(true);
        createGame(quizId, gameMode, gameMode === "timed" ? timerDifficulty : timerDifficulty)
            .then((game) => {
                setDisable(false);
                navigation.navigate('quizScreen', { gameId: game.id, gameMode: gameMode });
            })
            .catch((error) => {
                const errorMsg = error.status && error.message
                    ? `${error.status}: ${error.message}`
                    : error.toString();
                toast('error', 'Erreur', errorMsg, 3000, COLORS.toast.text.red);
                setDisable(false);
            });
    };

    const handleStartRoom = (gameMode) => {
        setDisable(true);
        let roomTeams = teams.length > 1 ? teams : ["Team 1", "Team 2"];
        const playerCount = gameMode === "scrum" ? scrumPlayerCount : 99;

        if (gameMode === "scrum" && playerCount <= 1) {
            toast("error", 'Il faut au moins deux joueurs pour lancer une partie', '', 2000, COLORS.toast.text.red);
            setDisable(false);
            return;
        }

        const roomPayload = {
            quizId,
            playerCount,
            gameMode,
            teams: roomTeams,
            difficulty: roomTimerDifficulty,
        };

        createRoom(roomPayload)
            .then((room) => { setDisable(false); navigation.navigate('room', { roomId: room.id }) })
            .catch((error) => {
                if (error.status && error.message) {
                    toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
                } else {
                    toast('error', 'Erreur', error, 3000, COLORS.toast.text.red);
                }
                setDisable(false);
            });
    };

    const handleTeamNameChange = (index, name) => {
        const newTeams = [...teams];
        newTeams[index] = name;
        setTeams(newTeams);
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={isMobile ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.view}>
                        <Text style={FONT.title}>Choisissez un mode de jeu</Text>
                        <View style={styles.container}>
                            <View style={styles.item}>
                                <SimpleButton text="Standard" onPress={() => handleStartQuiz()} disabled={disable} />
                                <Text style={FONT.paragraphe}>Le joueur dispose d’un temps illimité pour répondre à chaque question.</Text>
                            </View>
                            <View style={styles.item}>
                                <SimpleButton text="Compte à rebours" onPress={() => handleStartQuiz("timed")} disabled={disable} />
                                <Text style={FONT.paragraphe}>Le joueur dispose d’un temps limité pour répondre à chaque question : 30s (facile), 15s (moyen), ou 5s (difficile).</Text>
                                <ChoiseSelector value={timerDifficulty} onValueChange={setTimerDifficulty} defaultValue={true} />
                            </View>
                            <View style={styles.item}>
                                <SimpleButton text="SCRUM" onPress={() => handleStartRoom("scrum")} disabled={disable} />
                                <Text style={FONT.paragraphe}>Plusieurs joueurs jouent simultanément au même quiz. Le premier à répondre correctement gagne les points et déclenche la question suivante. Chaque joueur ne peut répondre qu'une fois par question.</Text>
                                <View style={styles.inputRow}>
                                    <Text style={styles.label}>Nombre de joueurs</Text>
                                    <TextInput
                                        placeholder="Nombre de joueurs"
                                        keyboardType="numeric"
                                        onChangeText={(text) => setScrumPlayerCount(text)}
                                        value={scrumPlayerCount.toString()}
                                        style={styles.input}
                                    />
                                </View>
                            </View>
                            <View style={styles.item}>
                                <SimpleButton text="TEAM" onPress={() => handleStartRoom("team")} disabled={disable} />
                                <Text style={FONT.paragraphe}>Les joueurs forment des équipes et répondent aux questions avec un temps limité, configurable par niveau de difficulté. Le score final de chaque équipe est la moyenne des scores de ses membres.</Text>
                                <ChoiseSelector value={roomTimerDifficulty} onValueChange={setRoomTimerDifficulty} defaultValue={true} />
                                <View style={styles.inputRow}>
                                    <Text style={styles.label}>Nombre d'équipes</Text>
                                    <TextInput
                                        placeholder="Nombre d'équipes"
                                        keyboardType="numeric"
                                        onChangeText={(text) => {
                                            const number = parseInt(text, 10);
                                            if (number > 6) {
                                                toast("error", "Le nombre de team est limité à 6", "", 2000, COLORS.toast.text.red);
                                                return;
                                            };
                                            setTeamCount(isNaN(number) ? "" : number);
                                            setTeams(isNaN(number) ? [] : Array.from({ length: number }, (_, i) => `Team ${i + 1}`));
                                        }}
                                        value={teamCount.toString()}
                                        style={styles.input}
                                    />
                                </View>
                                {teams.map((team, index) => (
                                    <View key={index} style={styles.inputRow}>
                                        <Text style={styles.label}>{`Nom de l'équipe ${index + 1}`}</Text>
                                        <TextInput
                                            placeholder={`Nom de l'équipe ${index + 1}`}
                                            value={team}
                                            onChangeText={(text) => handleTeamNameChange(index, text)}
                                            style={styles.input}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        width: '100%',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 10, // Ajoute un espace entre les items
    },
    item: {
        margin: 15,
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.palette.blue.normal,
        width: isMobile ? '93%' : '40%', // Augmente la largeur pour les écrans plus grands
        height: 'auto',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    paragraphSpacing: {
        marginTop: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        color: COLORS.text.dark,
        marginRight: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.palette.blue.normal,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    teamInputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    text: {
        fontSize: isMobile ? 16 : 20, // Taille de texte ajustée pour les écrans plus grands
        textAlign: 'center',
        color: COLORS.text.dark,
    },
    title: {
        fontSize: isMobile ? 24 : 32, // Agrandir les titres
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
});