import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, Platform, TextInput, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { getRoomId, hasToken } from "../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { ClipboardPaste } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../css/utils/color';
import SimpleButton from "../components/SimpleButton";

const platform = Platform.OS;

export default function JoinGame() {
  const [roomId, setRoomId] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);

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
      {Platform.OS === "android" && scanned === false && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />

      )}
      {scanned === true && (
        <>
          <Text style={styles.title}>Rejoindre une partie</Text>
          <View style={styles.inputView}>
            <TouchableOpacity onPress={handlePasteGameId}>
              <ClipboardPaste size={30} color="black" />
            </TouchableOpacity>
            <TextInput
              placeholder="Entrer le code de la partie"
              value={roomId}
              onChangeText={setRoomId}
              style={styles.input}
            />
          </View>
          <SimpleButton text="Rejoindre" onPress={() => handleConnect(roomId)} />
      </>)}

      {scanned === true && Platform.OS === "android" && (
        <>
          <SimpleButton text="Scanner le QR CODE" onPress={() => setScanned(false)} />
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.background.blue,
  },
  title: {
    fontSize: 50,
    textAlign: 'center',
    fontFamily: 'LobsterTwo_700Bold_Italic',
    color: COLORS.text.blue.dark,
  },
  input: {
    padding: 10,
    fontSize: 20,
    fontFamily: 'LobsterTwo_700Bold_Italic',
    color: COLORS.text.blue.dark,
  },
  inputView: {
    width: platform === 'web' ? '20%' : '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 40,
  },
});