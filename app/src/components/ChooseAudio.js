import React, { useCallback, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList,  StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import { uploadAudio, downloadAllAudios, downloadAudio } from '../utils/api';


const { width  , height} = Dimensions.get('window');
const isMobile = width< height


const ChooseAudio = ({ onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [audios, setAudios] = useState([]);
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [ids, setIds] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleAudioSelect = (uri, id) => {
        setSelectedAudio(uri);
        setSelectedId(id);
        setModalVisible(false);
        if (onValueChange) {
            onValueChange(uri, id);
        }
    };

    const selectFile = async () => {
        const file = document.getElementById('file').files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadAudio(formData);
            if (response.status === 200) {
                const fileURL = URL.createObjectURL(file);
                setAudios([...audios, fileURL]);
            }
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchAudios = async () => {
                try {
                    const response = await downloadAllAudios();
                    console.log(response);
                    if (response.files && Array.isArray(response.files)) {
                        const files = response.files;
                        const validFiles = files.filter(file => file.fileName.endsWith('.mp3'));
                        setIds(validFiles.map((file) => file.fileName));

                        const audioPromises = validFiles.map(async (file) => {
                            const { fileName } = file;
                            const audioBlob = await downloadAudio(fileName);
                            return URL.createObjectURL(audioBlob);
                        });

                        const fetchedAudios = await Promise.all(audioPromises);
                        setAudios((prevAudios) => [...prevAudios, ...fetchedAudios]);
                    } else {
                        console.error("La réponse de `downloadAllAudios` n'est pas valide.");
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des audios :", error);
                }
            };

            fetchAudios();
        }, [])
    );

    return (
        <View style={styles.themeListView}>
            <TouchableOpacity style={styles.paramButton} onPress={handleOpenModal}>
                <Text style={styles.paramButtonText}>
                    {selectedAudio ? "Modifier l'audio" : "Ajouter un audio"}
                </Text>
            </TouchableOpacity>

            {selectedAudio && (
                <audio controls src={selectedAudio} style={styles.audioPlayer}>
                    Votre navigateur ne supporte pas l'élément audio.
                </audio>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.themeListModal}>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept="audio/mp3"
                        onChange={selectFile}
                    />

                    <FlatList
                        horizontal={true}
                        data={audios}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() => handleAudioSelect(item, ids[index])}
                                style={styles.audioItem}
                            >
                                <Text style={styles.audioLabel}>Audio {index + 1}</Text>
                                <audio controls src={item} style={styles.audioPlayer}>
                                    Votre navigateur ne supporte pas l'élément audio.
                                </audio>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    themeListView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paramButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.button.blue.basic,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: !isMobile? '6%' : '20%',
        marginHorizontal: '10%',
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
    },
    audioItem: {
        margin: 10,
        padding: 10,
        backgroundColor: '#d3d3d3',
        borderRadius: 5,
    },
    audioLabel: {
        marginBottom: 5,
        fontSize: 16,
    },
    audioPlayer: {
        width: 200,
    },
});

export default ChooseAudio;
