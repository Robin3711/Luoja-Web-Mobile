import React, { useEffect, useState } from "react";
import { Text, View, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Clipboard as Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import GradientBackground from '../css/utils/linearGradient';

import { joinRoom, joinTeam, startRoom, getUserInfos } from "../utils/api";
import { getPlatformAPI, hasToken } from "../utils/utils";

import QRCode from "react-native-qrcode-svg";
import { COLORS } from "../css/utils/color";
import { FONT } from "../css/utils/font";
import SimpleButton from "../components/SimpleButton";
import { toast } from "../utils/utils";

const { width, height } = Dimensions.get('window');
const isMobile = width < height

const platform = Platform.OS;


export default function Room() {
    const route = useRoute();
    const navigation = useNavigation();

    const roomId = route.params.roomId;

    const [apiUrl, setApiUrl] = useState(null);
    const [players, setPlayers] = useState([]);

    const [teams, setTeams] = useState([]);

    const [gameMode, setGameMode] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [user, setUser] = useState(null);
    const [owner, setOwner] = useState(null);

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
                setOwner(data.players[0]);
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

    const handleReturnHome = async () => {
        navigation.navigate("initMenu");
    };

    const handleCopyRoomId = async () => {
        await Clipboard.setStringAsync(roomId);
        toast('info', 'L\'id à bien été copié !', "", 2000, COLORS.toast.text.blue);
    };

    useEffect(() => {
        const connect = async () => {
            try {

                if (! await hasToken()) {
                    navigation.navigate('initMenu', { screen: 'account', params: { roomId: roomId } });
                }
                else {
                    const userInfo = await getUserInfos();
                    setUser(userInfo.userName);
                    const source = await joinRoom(roomId);

                    eventSource = source;

                    eventSource.addEventListener('message', handleEvent);


                    eventSource.addEventListener('error', (err) => {
                        console.error("Erreur EventSource :", err);
                        toast("error", "Vous ne pouvez pas rejoindre cette partie", '', 3000, COLORS.toast.text.red);
                        navigation.navigate("initMenu");
                    });


                    const url = await getPlatformAPI();
                    setApiUrl(url);
                }
            } catch (error) {
                toast("error", error.status || 500, error.message || "Une erreur est survenue", 3000, COLORS.toast.text.red);
                navigation.navigate("initMenu");
            }
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [roomId]);

    return (
        <GradientBackground>
            <View style={styles.container}>
                <Text style={[FONT.title, styles.gameMode]}>Mode de jeu : {gameMode}</Text>
                {!isMobile ? (
                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            value={`https://luoja.fr/room?roomId=${roomId}`}
                            size={200}
                            color={COLORS.palette.blue.darker}
                            backgroundColor="white"
                        />
                        <TouchableOpacity onPress={handleCopyRoomId} style={styles.roomId}>
                            <Copy size={24} color="black" />
                            <Text style={FONT.text}>Room : {roomId}</Text>
                        </TouchableOpacity>
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
                                        value={`https://luoja.fr/room?roomId=${roomId}`}
                                        size={200}
                                        color={COLORS.palette.blue.darker}
                                        backgroundColor="white"
                                    />
                                    <TouchableOpacity onPress={handleCopyRoomId} style={styles.roomId}>
                                        <Copy size={24} color="black" />
                                        <Text style={[FONT.text, styles.title]}>Room : {roomId}</Text>
                                    </TouchableOpacity>
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
                        player === user ? (
                            player === owner ? (
                                <Text key={player} style={FONT.text}>👑 {player} (Vous)</Text>
                            ) :
                                (
                                    <Text key={player} style={FONT.textAlternate}>{player} (Vous)</Text>
                                )
                        ) : (
                            player === owner ? (
                                <Text key={player} style={FONT.text}> 👑 {player}</Text>
                            ) :
                                (
                                    <Text key={player} style={FONT.textAlternate}>{player}</Text>
                                )
                        )
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
                                    player === user ? (
                                        player === owner ? (
                                            <Text key={player} style={FONT.text}>👑 {player} (Vous)</Text>
                                        ) :
                                            (
                                                <Text key={player} style={FONT.text}>{player} (Vous)</Text>
                                            )
                                    ) : (
                                        player === owner ? (
                                            <Text key={player} style={FONT.text}> 👑 {player}</Text>
                                        ) :
                                            (
                                                <Text key={player} style={FONT.text}>{player}</Text>
                                            )
                                    )
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
                {gameMode === "team" && (
                    <View
                        style={[
                            styles.teamButtons,
                            { flexDirection: isMobile ? 'row' : 'column', justifyContent: 'center', gap: isMobile ? 10 : 0 },
                        ]}
                    >
                        {owner === user && (
                            <SimpleButton
                                text="Commencer la partie"
                                onPress={() => startRoom(roomId)}
                                color={COLORS.button.blue.basic}
                                marginBottom={isMobile ? 0 : 10}
                                marginVertical={isMobile ? 0 : 1}
                                width={isMobile ? "50%" : 300}
                            />
                        )}
                        {owner !== user && (
                            <Text style={FONT.subTitle}>En attente du lancement de la partie</Text>
                        )}
                        <SimpleButton
                            text="Retourner au menu"
                            onPress={handleReturnHome}
                            color={COLORS.button.blue.basic}
                            marginBottom={isMobile ? 0 : 1}
                            marginVertical={isMobile ? 0 : 1}
                            width={isMobile ? "50%" : 300}
                        />
                    </View>
                )}
                {gameMode === "scrum" && (
                    <View style={styles.teamButtons} >
                        <SimpleButton
                            text="Retourner au menu"
                            onPress={handleReturnHome}
                            color={COLORS.button.blue.basic}
                            width={isMobile ? "50%" : 300}
                        />
                    </View>
                )}
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        gap: !isMobile ? 20 : 0,
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    gameMode: {
        textAlign: 'center',
        marginBottom: 20,
        maxWidth: !isMobile ? '100%' : 210,
    },
    playersContainer: {
        flexDirection: 'row',
        marginVertical: !isMobile ? 10 : 0,
        maxWidth: 500,
        minHeight: 30,
    },
    teamsContainer: {
        maxWidth: '100%',
        overflow: 'scroll',
        flexDirection: 'row',
        marginVertical: 15,
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
        height: !isMobile ? "25%" : null,
        overflow: 'auto',
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
    teamButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        maxHeight: 200,
    },
    roomId: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});