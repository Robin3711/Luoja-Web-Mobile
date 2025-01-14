import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import ChoiseSelector from '../components/ChoicePicker';
import { createGame, createRoom } from '../utils/api';
import { toast } from '../utils/utils';
import { FONT } from '../css/utils/font';

const { width  , height} = Dimensions.get('window');
const isMobile = width< height

export default function LaunchGameMode() {
    const navigation = useNavigation();
    const route = useRoute();

    const quizId = route.params.quizId;
    const [timerDifficulty, setTimerDifficulty] = useState("easy");
    const [scrumDifficulty, setScrumDifficulty] = useState("easy");
    const [playerCount, setPlayerCount] = useState("");
    const [teamCount, setTeamCount] = useState("");
    const [teams, setTeams] = useState([]);

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
    };

    const handleStartRoom = (gameMode) => {
        let roomTeams;
        if (teams.length > 0) {
            roomTeams = teams;
        } else {
            roomTeams = ["Terroristes", "Contre-terroristes"];
        }

        switch (gameMode) {
            case "scrum":
                createRoom({ quizId: quizId, playerCount: playerCount, gameMode: gameMode }).then((room) => {
                    navigation.navigate('room', { roomId: room.id });
                });
                break;
            case "team":
                createRoom({ quizId: quizId, playerCount: playerCount, teams: roomTeams, gameMode: gameMode, difficulty: scrumDifficulty }).then((room) => {
                    navigation.navigate('room', { roomId: room.id });
                });
                break;
            default:
                break;
        }
    };

    const handleTeamNameChange = (index, name) => {
        const newTeams = [...teams];
        newTeams[index] = name;
        setTeams(newTeams);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.view}>
                <Text style={FONT.title}>Choisissez un mode de jeu</Text>
                <View style={styles.container}>
                    <View style={styles.item}>
                        <SimpleButton text="Standard" onPress={() => handleStartQuiz()} />
                        <Text style={FONT.paragraphe}>Le joueur dispose d’un temps illimité pour répondre à chaque question.</Text>
                    </View>
                    <View style={styles.item}>
                        <SimpleButton text="SCRUM" onPress={() => handleStartRoom("scrum")} />
                        <Text style={FONT.paragraphe}>Le joueur dispose d’un temps limité pour répondre à chaque question : 30s (facile), 15s (moyen), ou 5s (difficile).</Text>
                    </View>
                    <View style={styles.item}>
                        <SimpleButton text="Compte à rebourd" onPress={() => handleStartQuiz("timed")} />
                        <Text style={FONT.paragraphe}>Plusieurs joueurs jouent simultanément au même quiz. Le premier à répondre correctement gagne les points et déclenche la question suivante. Chaque joueur ne peut répondre qu'une fois par question.</Text>
                        <ChoiseSelector value={timerDifficulty} onValueChange={setTimerDifficulty} defaultValue={true} />
                    </View>
                    <View style={styles.item}>
                        <SimpleButton text="TEAM" onPress={() => handleStartRoom("team")} />
                        <Text style={FONT.paragraphe}>Les joueurs forment des équipes et répondent aux questions avec un temps limité, configurable par niveau de difficulté. Le score final de chaque équipe est la moyenne des scores de ses membres.</Text>
                        <TextInput
                            placeholder="Nombre de joueurs"
                            keyboardType="numeric"
                            onChangeText={(text) => setPlayerCount(text)}
                            value={playerCount.toString()}
                        />
                        <TextInput
                            placeholder="Nombre d'équipes"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                const number = parseInt(text, 10);
                                if (isNaN(number)) {
                                    setTeamCount("");
                                    setTeams([]);
                                } else {
                                    setTeamCount(number);
                                    setTeams(Array.from({ length: number }, (_, i) => `Team ${i + 1}`));
                                }
                            }}
                            value={teamCount.toString()}
                        />
                        {teams.map((team, index) => (
                            <TextInput
                                key={index}
                                placeholder={`Nom de l'équipe ${index + 1}`}
                                value={team}
                                onChangeText={(text) => handleTeamNameChange(index, text)}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
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
        padding: 10,
        backgroundColor: COLORS.background.blue,
        width: '100%',
    },
    container: {
        flex: 1,
        width: '100%',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    item: {
        flex: 1,
        margin: 10,
        padding: 25,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: COLORS.palette.blue.normal,
        width: isMobile ? '90%' : '40%',
    },
});