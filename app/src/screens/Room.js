import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { joinRoom, joinTeam, startRoom } from "../utils/api";
import { getPlatformAPI } from "../utils/utils";

import QRCode from "react-native-qrcode-svg";
import { COLORS } from "../css/utils/color";
import { FONT } from "../css/utils/font";

export default function Room() {
    const route = useRoute();
    const navigation = useNavigation();

    const roomId = route.params.roomId;

    const [apiUrl, setApiUrl] = useState(null);
    const [players, setPlayers] = useState([]);

    const [teams, setTeams] = useState([]);

    let eventSource = null;

    let gameMode = null;

    const handleEvent = (event) => {
        const data = JSON.parse(event.data);

        switch (data.eventType) {
            case "connectionEstablished":
                gameMode = data.gameMode;
                break;
            case "playerJoined":
                setPlayers(data.players);
                break;
            case "teams":
                setTeams(data.teams);
                break;
            case "gameStart":
                navigation.navigate("roomQuizScreen", { roomId: roomId, eventSource: eventSource, gameMode: gameMode });
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (eventSource) {
            eventSource.close();
        };
        const connect = async () => {
            joinRoom(roomId).then((source) => {
                eventSource = source;

                eventSource.addEventListener("message", handleEvent);

                getPlatformAPI().then((url) => setApiUrl(url));
            });
        };

        connect();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={[FONT.title, styles.title]}>Room {roomId}</Text>
            <Text style={FONT.text}>Game mode: {gameMode}</Text>
            <Text style={FONT.text}>Players:</Text>
            <View>
                {players.map((player) => (
                    <Text key={player} style={FONT.text}>{player}</Text>
                ))}
            </View>
            {gameMode === "team" && teams.map((team, index) => (
                <View key={index}>
                    <Text style={FONT.text}>Team {team.name}</Text>
                    <TouchableOpacity onPress={() => joinTeam(roomId, team.name)}>
                        <Text style={FONT.text}>Join Team</Text>
                    </TouchableOpacity>
                    <View>
                        {team.players.map((player) => (
                            <Text key={player} style={FONT.text}>{player}</Text>
                        ))}
                    </View>
                </View>
            ))}
            <View style={{ borderWidth: 10, borderColor: COLORS.palette.blue.darker, borderRadius: 30, padding: 10, backgroundColor: 'white' }}>
                <QRCode
                    value={`${apiUrl}/room/${roomId}/join`}
                    size={200}
                    color={COLORS.palette.blue.darker}
                    backgroundColor="white"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.background.blue,
        gap: 50,
    },
    title: {
        position: 'absolute',
        top: 50,
    },
});