import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert,  TextInput } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { getRoomId, hasToken } from "../utils/utils";
import { useNavigation } from "@react-navigation/native";


export default function JoinGame() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const navigation = useNavigation();

const { width  , height} = Dimensions.get('window');
const isMobile = width< height

  useEffect(() => {
    if (!hasToken()) {
        navigation.navigate('login');
    };
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    if(isMobile)
    {
      getCameraPermissions();
    }
  }, []);

  const handleConnect = async (roomId) => {
    navigation.navigate('room', { roomId: roomId });
  }


  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    if (type === "qr")
         {
            const roomId = getRoomId(data);
            Alert.alert(
                "Code détectée",
                `Voulez-vous rejoindre cette partie ?\n${roomId}`,
                [
                { text: "Annuler", style: "cancel", onPress: () => setScanned(false) },
                { text: "Ouvrir", onPress: () =>  handleConnect(roomId) },
                ]
            );
        }

  };

  if (hasPermission === null && isMobile) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false && isMobile) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isMobile && ( 
        <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      
    )}
    {!isMobile && (
      <TextInput placeholder="Enter Room ID" onSubmitEditing={(e) => handleConnect(e.nativeEvent.text)} style={styles.input} />
    )}
    {scanned && !isMobile && (
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
  input : {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  }
});