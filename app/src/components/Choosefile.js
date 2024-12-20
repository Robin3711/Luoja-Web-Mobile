import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Platform, StyleSheet, Image } from 'react-native';
import { Dices } from 'lucide-react-native';
import { COLORS } from '../css/utils/color';
import icon from '../../assets/icon.png';
import { iconSize } from '../utils/utils';
import { uploadImage, downloadAllImages, downloadImage } from '../utils/api';
import { useFocusEffect } from '@react-navigation/native';
import ImageSelect from './ImageSelect';
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

        uploadImage(formData).then((response) => {
            if (response.status === 200) {
                setImages([...images, URL.createObjectURL(file)]);
            }
        }
        ).catch((error) => {
            console.log(error);
        }
        );
        
    };


    useFocusEffect(
        useCallback(() => {
            const fetchImages = async () => {
                try {
                    const response = await downloadAllImages();
                    if (response.files && Array.isArray(response.files)) {
                        const files = response.files;
                        setIds(files.map((file) => file.fileName));
    
                        // Traiter chaque `fileName` pour télécharger les images
                        const imagePromises = files.map(async (file) => {
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

                    <FlatList
                        horizontal={true}
                        data={images}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <ImageSelect uri={item} onImageSelect={handleImageSelect} id={ids[index]}/>
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
