import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Dimensions, Platform, StyleSheet, Alert, TextInput, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { getRoomId, requireToken, toast } from "../utils/utils";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ClipboardPaste } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../css/utils/color';
import SimpleButton from "../components/SimpleButton";
import GradientBackground from '../css/utils/linearGradient';
import { FONT } from "../css/utils/font";

const { width, height } = Dimensions.get('window');
const isMobile = width < height
const platform = Platform.OS;

export default function JoinGame() {
  const [roomId, setRoomId] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    if (platform === "android") {
      getCameraPermissions();
    }
  }, []);

  const handleConnect = async (roomId) => {
    navigation.navigate('room', { roomId: roomId });
  }

  const handleConnectWithCode = async (roomId) => {
    if (roomId === '') {
      toast('error', 'Erreur', 'Veuillez saisir un identifiant de partie', 3000, COLORS.toast.text.red);
      return;
    }
    navigation.navigate('room', { roomId: roomId.toLowerCase() });
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

  if (hasPermission === null && platform === "android") {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false && platform === "android") {
    return <Text>No access to camera</Text>;
  }

  return (
    <GradientBackground showLogo={true}>
      <View style={styles.container}>
        {platform === "android" && scanned === false && (
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
            <Text style={FONT.title}>Rejoindre une partie</Text>
            <View style={styles.inputView}>
              <TouchableOpacity onPress={handlePasteGameId}>
                <ClipboardPaste size={30} color="black" />
              </TouchableOpacity>
              <TextInput
                placeholder="Entrer le code de la partie"
                value={roomId}
                onChangeText={setRoomId}
                style={styles.input}
                autoFocus
              />
            </View>
            <SimpleButton text="Rejoindre" onPress={() => handleConnectWithCode(roomId)} />
          </>)}

        {scanned === true && Platform.OS === "android" && (
          <>
            <SimpleButton text="Scanner le QR CODE" onPress={() => setScanned(false)} />
          </>
        )}

      </View>
    </GradientBackground>
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
  },
  input: {
    padding: 10,
    fontSize: 20,
    fontFamily: 'LobsterTwo_700Bold_Italic',
    color: COLORS.text.blue.dark,
  },
  inputView: {
    width: !isMobile ? '20%' : '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 40,
  },
});