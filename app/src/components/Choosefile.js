import React, { useCallback, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Platform, StyleSheet, Image, ScrollView } from 'react-native';
import { COLORS } from '../css/utils/color';
import { uploadImage, downloadAllImages, downloadImage, deleteFile } from '../utils/api';
import { useFocusEffect } from '@react-navigation/native';
import ImageSelect from './ImageSelect';
import SimpleButton from './SimpleButton';

const platform = Platform.OS;

const ChooseFile = ({ onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [ids, setIds] = useState([]);
    const [selectedId, setSelectedId] = useState(null);


    const handleOpenModal = () => {
        setModalVisible(true);
    }

    const handleImageSelect = (uri, id) => {
        setSelectedImage(uri);
        setSelectedId(id);
        setModalVisible(false); // Fermer le modal après la sélection
        if (onValueChange) {
            onValueChange(uri, id); // Envoie l'image sélectionnée au parent
        }
    };

    const selectFile = async () => {
        const file = document.getElementById('file').files[0];
        const formData = new FormData();
        formData.append('file', file);

        uploadImage(formData).then(async (response) => {
            if (response.status === 200) {
                const jsonResponse = await response.json();
                setTimeout(() => {

                    const responseId = jsonResponse.filePath;
                    setIds([...ids, responseId]);
                    downloadImage(responseId).then((response) => {
                        const url = URL.createObjectURL(response);
                        setImages([...images, url])
                    })

                }, 200);

            }
        }).catch((error) => {
            console.log(error);

        }
        );
    };

    const handleRefreshImages = async (id) => {
        try {
            const reponseDelete = await deleteFile(id);
            const response = await downloadAllImages();
            if (response.files && Array.isArray(response.files)) {
                const files = response.files;
                const validFiles = files.filter(file => file.fileName.endsWith('.png' || '.jpg' || '.jpeg'));
                setIds(validFiles.map((file) => file.fileName));

                // Traiter chaque `fileName` pour télécharger les images
                const imagePromises = validFiles.map(async (file) => {
                    const { fileName } = file;
                    const imageBlob = await downloadImage(fileName);

                    // Convertir le blob en URL locale
                    const imageURL = URL.createObjectURL(imageBlob);
                    return imageURL;
                });

                // Résoudre toutes les promesses
                const fetchedImages = await Promise.all(imagePromises);

                // Mettre à jour l'état des images
                setImages(fetchedImages);
            } else {
                console.error("La réponse de `downloadAllImages` n'est pas valide.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des images :", error);
        }
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    }

    useFocusEffect(
        useCallback(() => {
            const fetchImages = async () => {
                try {
                    const response = await downloadAllImages();
                    if (response.files && Array.isArray(response.files)) {
                        const files = response.files;
                        const validFiles = files.filter(file => file.fileName.endsWith('.png' || '.jpg' || '.jpeg'));
                        setIds(validFiles.map((file) => file.fileName));

                        // Traiter chaque `fileName` pour télécharger les images
                        const imagePromises = validFiles.map(async (file) => {
                            const { fileName } = file;
                            const imageBlob = await downloadImage(fileName);

                            // Convertir le blob en URL locale
                            const imageURL = URL.createObjectURL(imageBlob);
                            return imageURL;
                        });

                        // Résoudre toutes les promesses
                        const fetchedImages = await Promise.all(imagePromises);

                        // Mettre à jour l'état des images
                        setImages((prevImages) => [...prevImages, ...fetchedImages]);
                    } else {
                        console.error("La réponse de `downloadAllImages` n'est pas valide.");
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des images :", error);
                }
            };

            fetchImages();
        }, [])
    );


    return (
        <View style={styles.themeListView}>
            <TouchableOpacity style={styles.paramButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.paramButtonText}>
                    {selectedImage ? "Modifier l'image" : "Ajouter une image"}
                </Text>
            </TouchableOpacity>

            {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
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
                        accept="image/*"
                        onChange={selectFile}
                    />
                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={styles.scrollViewContenair}
                        style={{ maxWidth: 1000 }}
                    >
                        <FlatList
                            horizontal={true}
                            data={images}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <>
                                    <ImageSelect uri={item} onImageSelect={handleImageSelect} id={ids[index]} />
                                    <TouchableOpacity onPress={() => handleRefreshImages(ids[index])}>
                                        <Text>Supprimer</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        />
                    </ScrollView>
                    <SimpleButton text={"Fermer"} onPress={handleCloseModal} />
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
