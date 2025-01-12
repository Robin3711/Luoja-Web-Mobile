import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { joinRoom } from "../utils/api";
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
        <View style={styles.container}>
            <Text style={[FONT.title, styles.title]}>Room {roomId}</Text>     
            <View>    
                <Text style={FONT.text}>Players :</Text>
                <View style={FONT.text}>
                    {players.map((player) => (
                        <Text key={player} style={FONT.text}>{player}</Text>
                    ))}
                </View>
            </View>   
            <View style={{ borderWidth: 10 , borderColor: COLORS.palette.blue.darker, borderRadius: 30, padding: 10, backgroundColor: 'white' }}>
                <QRCode
                    value={`${apiUrl}/room/${roomId}/join`}
                    size={200}
                    color= {COLORS.palette.blue.darker}
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