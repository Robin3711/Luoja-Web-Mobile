import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { joinRoom } from "../utils/api";
import { getPlatformAPI } from "../utils/utils";

import QRCode from "react-native-qrcode-svg";

export default function Room() {
    const route = useRoute();
    const navigation = useNavigation();

    const roomId = route.params.roomId;

    const [apiUrl, setApiUrl] = useState(null);

    const [players, setPlayers] = useState([]);

    let eventSource = null;
    
    const handleEvent = (event) => {
        const data = JSON.parse(event.data);

        switch (data.eventType) {
            case "connectionEstablished":
                console.log("Connection established");
                break;
            case "playerJoined":
                setPlayers(data.players);
                break;
            case "gameStart":
                navigation.navigate("roomQuizScreen", { roomId: roomId, eventSource: eventSource });
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
            <Text>Players :</Text>
            <View>
                {players.map((player) => (
                    <Text key={player}>{player}</Text>
                ))}
            </View>
            <QRCode 
                value={`${apiUrl}/room/${roomId}/join`} 
                size={200} 
                color="black" 
                backgroundColor="white"
            />
        </View>
    );
}