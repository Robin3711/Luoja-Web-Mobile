import React, { useCallback, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Dimensions, StyleSheet, Image, ScrollView } from 'react-native';
import { COLORS } from '../css/utils/color';
import { uploadImage, downloadAllImages, downloadImage, deleteFile } from '../utils/api';
import { useFocusEffect } from '@react-navigation/native';
import ImageSelect from './ImageSelect';
import SimpleButton from './SimpleButton';
import { toast } from '../utils/utils';


const { width, height } = Dimensions.get('window');
const isMobile = width < height


const ChooseFile = ({ onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [ids, setIds] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [disable, setDisable] = useState(false);


    const fetchImages = async () => {
        try {
            const response = await downloadAllImages();
            if (response.files && Array.isArray(response.files)) {
                const files = response.files;

                const validFiles = files.filter(file =>
                    file.fileName.endsWith('.png') ||
                    file.fileName.endsWith('.jpg') ||
                    file.fileName.endsWith('.jpeg')
                );

                setIds(validFiles.map((file) => file.fileName));
                const imagePromises = validFiles.map(async (file) => {
                    console.log(file);
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
            if (error.status && error.message) {
                toast("error", error.status, error.message, 1500, COLORS.toast.text.red);
            } else {
                toast('error', 'Erreur', error, 1500, COLORS.toast.text.red);
            }
        }
    };


    const handleOpenModal = () => {
        fetchImages();
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
            setDisable(true);
            await deleteFile(id);
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
            setDisable(false);
        } catch (error) {
            if (error.message !== "Aucun fichier trouvé pour cet utilisateur") {
                if (error.status && error.message) {
                    toast("error", error.status, error.message, 1500, COLORS.toast.text.red);
                } else {
                    toast('error', 'Erreur', error, 1500, COLORS.toast.text.red);
                }
            }
            setDisable(false);
        }
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    }

    useFocusEffect(
        useCallback(() => {
            fetchImages();
        }, [])
    );


    return (
        <View style={styles.themeListView}>
            <TouchableOpacity style={styles.paramButton} onPress={handleOpenModal}>
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
                        style={styles.inputFile}
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
                                <View style={styles.imageItem}>
                                    <ImageSelect uri={item} onImageSelect={handleImageSelect} id={ids[index]} />
                                    <SimpleButton text="Supprimer" onPress={() => handleRefreshImages(ids[index])} disabled={disable} />
                                </View>
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
        marginVertical: !isMobile ? '6%' : '20%',
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
        width: !isMobile ? 350 : '100%',
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
    inputFile: {
        margin: 10,
        padding: 30,
        backgroundColor: COLORS.palette.blue.lighter,
        borderRadius: 10,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        fontSize: 20,
    },
    imageItem: {
        margin: 10,
        padding: 10,
        backgroundColor: COLORS.palette.blue.lighter,
        borderRadius: 5,
        width: "400px", // Fixe la largeur des éléments
        height: "300px",
        alignItems: 'center',
    },
});

export default ChooseFile;
