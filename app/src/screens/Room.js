import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { joinRoom, joinTeam, startRoom } from "../utils/api";
import { getPlatformAPI } from "../utils/utils";

import QRCode from "react-native-qrcode-svg";

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
        const connect = async () => {

            joinRoom(roomId).then((source) => {
                eventSource = source;

                eventSource.onmessage = handleEvent;

                getPlatformAPI().then((url) => setApiUrl(url));
            });
        };

        connect();
    }, []);

    return (
        <View>
            <Text>Room {roomId}</Text>
            <Text>Game mode : {gameMode}</Text>
            <Text>Players :</Text>
            <View>
                {players.map((player) => (
                    <Text key={player}>{player}</Text>
                ))}
            </View>
            {
                gameMode === "team" &&
                teams.map((team, index) => (
                    <View key={index}>
                        <Text>Team {team.name}</Text>
                        <TouchableOpacity onPress={() => joinTeam(roomId, team.name)}>
                            <Text>Join Team</Text>
                        </TouchableOpacity>
                        <View>
                            {team.players.map((player) => (
                                <Text key={player}>{player}</Text>
                            ))}
                        </View>
                    </View>
                ))
            }
            {
                gameMode === "team" &&
                <TouchableOpacity onPress={() => startRoom(roomId)}>
                    <Text>Start Game</Text>
                </TouchableOpacity>
            }
            <QRCode
                value={`${apiUrl}/room/${roomId}/join`}
                size={200}
                color="black"
                backgroundColor="white"
            />
        </View>
    );
}