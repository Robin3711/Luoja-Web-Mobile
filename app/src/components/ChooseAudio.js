import React, { useCallback, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Platform, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import { uploadAudio, downloadAllAudios, downloadAudio, uploadImage, deleteFile } from '../utils/api';

const platform = Platform.OS;

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
        if (file.size > 1000000) {
            alert("Le fichier est trop volumineux. Veuillez choisir un fichier de moins de 1 Mo.");
            return;
        }

        uploadAudio(formData).then(async (response) => {
            if (response.status === 200) {
                const jsonResponse = await response.json();
                const responseId = jsonResponse.filePath;
                setIds([...ids, responseId]);
                downloadAudio(responseId).then((response) => {
                    const url = URL.createObjectURL(response);
                    setAudios([...audios, url]);
                })
            }
        }
        ).catch((error) => {
            console.log(error);
        }
        );
    };

    const handleRefreshAudios = async (id) => {
        try {
            const reponseDelete = await deleteFile(id);
            const response = await downloadAllAudios();
            console.log(response);
            if (response.files && Array.isArray(response.files)) {
                const files = response.files;
                const validFiles = files.filter(file => file.fileName.endsWith('.mp3' || '.mpeg'));
                console.log(validFiles);
                setIds(validFiles.map((file) => file.fileName));

                const audioPromises = validFiles.map(async (file) => {
                    const { fileName } = file;
                    const audioBlob = await downloadAudio(fileName);
                    return URL.createObjectURL(audioBlob);
                });

                const fetchedAudios = await Promise.all(audioPromises);
                setAudios(fetchedAudios);
            } else {
                console.error("La réponse de `downloadAllAudios` n'est pas valide.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des images :", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            const fetchAudios = async () => {
                try {
                    const response = await downloadAllAudios();
                    console.log(response);
                    if (response.files && Array.isArray(response.files)) {
                        const files = response.files;
                        const validFiles = files.filter(file => file.fileName.endsWith('.mp3' || '.mpeg'));
                        console.log(validFiles);
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
                        accept="audio/*"
                        onChange={selectFile}
                    />
                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={styles.scrollViewContenair}
                        style={{ maxWidth: 1000 }}
                    >
                        {audios.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleAudioSelect(item, ids[index])}
                                style={styles.audioItem}
                            >
                                <Text style={styles.audioLabel}>Audio {index + 1}</Text>
                                <audio controls src={item} style={styles.audioPlayer}>
                                    Votre navigateur ne supporte pas l'élément audio.
                                </audio>
                                <TouchableOpacity onPress={() => handleRefreshAudios(ids[index])}>
                                    <Text>Supprimer</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
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
        marginVertical: platform === 'web' ? '6%' : '20%',
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
        width: "200px", // Fixe la largeur des éléments
        alignItems: 'center',
    },
    audioLabel: {
        marginBottom: 5,
        fontSize: 16,
    },
    audioPlayer: {
        width: '100%',
        height: '100%',
    },
    scrollViewContenair: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        width: '10%',
    },
});

export default ChooseAudio;
