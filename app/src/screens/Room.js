import React, { useEffect, useState } from "react";
import { Text, View, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { joinRoom, joinTeam, startRoom } from "../utils/api";
import { getPlatformAPI } from "../utils/utils";

import QRCode from "react-native-qrcode-svg";
import { COLORS } from "../css/utils/color";
import { FONT } from "../css/utils/font";
import SimpleButton from "../components/SimpleButton"; // Import SimpleButton

const { width  , height} = Dimensions.get('window');
const isMobile = width< height



export default function Room() {
    const route = useRoute();
    const navigation = useNavigation();

    const roomId = route.params.roomId;

    const [apiUrl, setApiUrl] = useState(null);
    const [players, setPlayers] = useState([]);

    const [teams, setTeams] = useState([]);

    const [gameMode, setGameMode] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    let gameCopy = null;

    let eventSource = null;

    const handleEvent = (event) => {
        const data = JSON.parse(event.data);

        switch (data.eventType) {
            case "connectionEstablished":
                gameCopy = data.gameMode;
                setGameMode(data.gameMode);
                break;
            case "playerJoined":
                setPlayers(data.players);
                break;
            case "teams":
                setTeams(data.teams);
                break;
            case "gameStart":
                navigation.navigate("roomQuizScreen", { roomId: roomId, eventSource: eventSource, gameMode: gameCopy });
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        const connect = async () => {
            joinRoom(roomId).then((source) => {
                eventSource = source;

                eventSource.addEventListener('message', handleEvent);

                getPlatformAPI().then((url) => setApiUrl(url));
            });
        };

        connect();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={[FONT.title, styles.gameMode]}>Mode de jeu : {gameMode}</Text>
            {!isMobile ? (
                <View style={styles.qrCodeContainer}>
                    <QRCode
                        value={`${apiUrl}/room/${roomId}/join`}
                        size={200}
                        color={COLORS.palette.blue.darker}
                        backgroundColor="white"
                    />
                    <Text style={[FONT.text, styles.title]}>Room {roomId}</Text>
                </View>
            ) : (
                <>
                    <TouchableOpacity style={styles.qrCodeButton} onPress={() => setModalVisible(true)}>
                        <Text style={FONT.text}>QR Code</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <QRCode
                                    value={`${apiUrl}/room/${roomId}/join`}
                                    size={200}
                                    color={COLORS.palette.blue.darker}
                                    backgroundColor="white"
                                />
                                <Text style={[FONT.text, styles.title]}>Room {roomId}</Text>
                                <SimpleButton
                                    text="Close"
                                    onPress={() => setModalVisible(false)}
                                    color={COLORS.button.blue.basic}
                                />
                            </View>
                        </View>
                    </Modal>
                </>
            )}
            <Text style={FONT.subTitle}>Joueurs :</Text>
            <ScrollView horizontal style={styles.playersContainer}>
                {players.map((player) => (
                    <Text key={player} style={FONT.text}>  {player}  </Text>
                ))}
            </ScrollView>
            <ScrollView horizontal style={styles.teamsContainer}>
                {gameMode === "team" && teams.map((team, index) => (
                    <View key={index} style={styles.team}>
                        <Text style={FONT.subTitle}>{team.name}</Text>
                        <SimpleButton
                            text="Rejoindre"
                            onPress={() => joinTeam(roomId, team.name)}
                            color={COLORS.button.blue.basic}
                        />
                        <View style={styles.teamPlayersContainer}>
                            {team.players.map((player) => (
                                <Text key={player} style={FONT.text}>{player}</Text>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
            {gameMode === "team" && (
                <SimpleButton
                    text="Start Game"
                    onPress={() => startRoom(roomId)}
                    color={COLORS.button.blue.basic}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Aligner les éléments en haut
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.background.blue,
        gap: 20,
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    gameMode: {
        textAlign: 'center',
        marginBottom: 20,
        maxWidth: !isMobile ? '100%' : 200,
    },
    playersContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        maxWidth: 400,
    },
    teamsContainer: {
        maxWidth: '100%',
        overflow: 'scroll',
        flexDirection: 'row',
        marginVertical: 20,
    },
    team: {
        alignItems: 'center',
        margin: 10,
        borderWidth: 5,
        borderColor: COLORS.palette.blue.darker,
        borderRadius: 30,
        padding: 10,
        height: 270,
    },
    teamPlayersContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        height: 150,
        overflow: 'scroll',
        
    },
    qrCodeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: COLORS.button.blue.basic,
        padding: 10,
        borderRadius: 10,
    },
    qrCodeContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderWidth: 10,
        borderColor: COLORS.palette.blue.darker,
        borderRadius: 30,
        padding: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    startButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: COLORS.button.blue.basic,
        padding: 10,
        borderRadius: 10,
    },
});