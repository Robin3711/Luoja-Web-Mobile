import React, { useCallback, useState } from 'react';
import { View, Text, Modal, TouchableOpacity,  StyleSheet, ScrollView , Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';
import { uploadAudio, downloadAllAudios, downloadAudio, deleteFile } from '../utils/api';
import SimpleButton from './SimpleButton';
import { toast } from '../utils/utils';


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
        if (file.size > 1000000) {
            toast('warn', 'Le fichier est trop volumineux. Veuillez choisir un fichier de moins de 1 Mo.', '', 1500, COLORS.toast.text.orange);
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
            await deleteFile(id);
            const response = await downloadAllAudios();
            if (response.files && Array.isArray(response.files)) {
                const files = response.files;

                const validFiles = files.filter(file =>
                    file.fileName.endsWith('.mp3') || 
                    file.fileName.endsWith('.mpeg')
                );

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
            if (error.status && error.message) {
                toast("error", error.status, error.message, 1500, COLORS.toast.text.red);
            } else {
                toast('error', 'Erreur', error, 1500, COLORS.toast.text.red);
            }
        }
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    }

    useFocusEffect(
        useCallback(() => {
            const fetchAudios = async () => {
                try {
                    const response = await downloadAllAudios();
                    if (response.files && Array.isArray(response.files)) {
                        const files = response.files;
                        const validFiles = files.filter(file => file.fileName.endsWith('.mp3' || '.mpeg'));
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
                    if (error.status && error.message) {
                        toast("error", error.status, error.message, 1500, COLORS.toast.text.red);
                    } else {
                        toast('error', 'Erreur', error, 1500, COLORS.toast.text.red);
                    }
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
                style={styles.modal}
            >
                <View style={styles.themeListModal}>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept="audio/*"
                        onChange={selectFile}
                        style={styles.inputFile}
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
                                <SimpleButton text="Supprimer" onPress={() => handleRefreshAudios(ids[index])}/>

                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <SimpleButton text={"Fermer"} onPress={handleCloseModal} />
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: !isMobile? '6%' : '20%',
            marginHorizontal: '10%',
            backgroundColor: COLORS.background.blue,
            padding: 20,
            borderRadius: 10,
            borderWidth: 5,
            borderStyle: 'solid',
            borderColor: COLORS.button.blue.basic,
        },
    audioItem: {
        margin: 10,
        padding: 10,
        backgroundColor: COLORS.palette.blue.lighter,
        borderRadius: 5,
        width: "400px", // Fixe la largeur des éléments
        height: "250px",
        alignItems: 'center',
    },
    audioLabel: {
        padding: 10,
        fontSize: 40,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
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
    inputFile: {
        margin: 10,
        padding: 30,
        backgroundColor: COLORS.palette.blue.lighter,
        borderRadius: 10,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        fontSize: 20,
    }
});

export default ChooseAudio;
