import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Platform, StyleSheet, Image } from 'react-native';
import { Dices } from 'lucide-react-native';
import { COLORS } from '../css/utils/color';
import icon from '../../assets/icon.png';
import { iconSize } from '../utils/utils';
import * as DocumentPicker from 'expo-document-picker';
import { uploadImage } from '../utils/api';

const platform = Platform.OS;

const ChooseFile = ({ onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);
    const [fileUri, setFileUri] = useState(icon.uri);
    const [fileName, setFileName] = useState("icon");
    const [fileType, setFileType] = useState("image/png");
    const [fileData, setFileData] = useState(null);

    const handleOpenModal = () => {
        setModalVisible(true);
    }


    const selectFile = async () => {
        const object = await DocumentPicker.getDocumentAsync({});
        console.log(object);
        const result = object.assets[0].uri;
        console.log(result);
        setFile(result);
        setImages([...images, result]);
        setFileUri(object.assets[0].uri);
        setFileName(object.assets[0].name);
        setFileType(object.assets[0].mimeType)

        const fileContent = new FormData();
        fileContent.append('file', {
            name: fileName,
            type: fileType,
            uri: fileUri,
        });

        setFileData(fileContent);

        const response = await uploadImage(fileData);
        console.log(response);
    };


    return (
        <View style={styles.themeListView}>
            <TouchableOpacity style={styles.paramButton} onPress={handleOpenModal}><Text style={styles.paramButtonText}>Ajouter une image</Text></TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.themeListModal}>

                    <TouchableOpacity
                        style={styles.themeButton}
                        onPress={selectFile}>
                        <Text style={[styles.themeLabel, { fontWeight: 'bold' }]}><Dices color="black" size={iconSize} /> Choisir l'image</Text>
                    </TouchableOpacity>
                    
                    <FlatList
                        data={images}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={{ width: 200, height: 200 }} />
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    themeListView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paramButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#58BDFE',
        width: '100%',
        padding: 15,
        borderRadius: 20,
    },
    paramButtonText: {
        backgroundColor: 'white',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        padding: 10,
        borderRadius: 10,
        fontSize: 15,
    },
    themeListModal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: platform === 'web' ? '6%' : '20%',
        marginHorizontal: '10%',
        backgroundColor: COLORS.background.blue,
        padding: 20,
        borderRadius: 10,
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: COLORS.button.blue.basic,
    },
    defaultThemeButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: COLORS.background.blue,
    },
    themeButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
        backgroundColor: COLORS.button.blue.basic,
        width: platform === 'web' ? 350 : '100%',
        height: 70,
    },
    themeLabel: {
        fontSize: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        gap: 10,
    },
});

export default ChooseFile;
