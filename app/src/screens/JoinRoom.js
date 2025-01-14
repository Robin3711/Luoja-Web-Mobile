import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, Platform, TextInput, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { getRoomId, hasToken } from "../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { ClipboardPaste } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';


export default function JoinGame() {
  const [roomId, setRoomId] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (!hasToken()) {
      navigation.navigate('login');
    };
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    if (Platform.OS === "android") {
      getCameraPermissions();
    }
  }, []);

  const handleConnect = async (roomId) => {
    navigation.navigate('room', { roomId: roomId });
  }

  const handlePasteGameId = async () => {
    const idOfGame = await Clipboard.getStringAsync();
    setRoomId(idOfGame);
  };

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    if (type === "qr") {
      const roomId = getRoomId(data);
      Alert.alert(
        "Code détectée",
        `Voulez-vous rejoindre cette partie ?\n${roomId}`,
        [
          { text: "Annuler", style: "cancel", onPress: () => setScanned(false) },
          { text: "Ouvrir", onPress: () => handleConnect(roomId) },
        ]
      );
    }

  };

  if (hasPermission === null && Platform.OS === "android") {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false && Platform.OS === "android") {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {Platform.OS === "android" && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />

      )}
      {Platform.OS === "web" && (
        <>
          <TouchableOpacity onPress={handlePasteGameId}>
            <ClipboardPaste size={30} color="black" />
          </TouchableOpacity>
          <TextInput
            placeholder="Enter Room ID"
            value={roomId}
            onChangeText={setRoomId}
            style={styles.input}
          />
          <Button title="Rejoindre" onPress={() => handleConnect(roomId)} />
        </>
      )}

      {scanned && Platform.OS === "web" && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  }
});