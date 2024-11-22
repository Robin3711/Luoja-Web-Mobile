import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, FlatList, Platform } from 'react-native';
import { getPlatformStyle, themeOptions } from '../utils/utils';

const styles = getPlatformStyle();

const ThemeSelector = ({ onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenModal = () => {
        setModalVisible(true);
    }

    const handleThemeSelection = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.cursorContainer}>
            <Text style={styles.parametersText}>Choisissez un thème</Text>
            <TouchableOpacity style={styles.paramButton} onPress={handleOpenModal}><Text>Ouvrir la liste</Text></TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.paramCenteredView}>
                    <View style={styles.paramModalView}>
                        <Pressable
                            style={styles.paramDefaultGridButton}
                            onPress={() => handleThemeSelection('none')}>
                            <Text style={styles.paramGridButtonText}>Thème générale</Text>
                        </Pressable>
                        <FlatList
                            data={themeOptions}
                            numColumns={Platform.OS === 'web' ? 3 : 1}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.paramGridButton}
                                    onPress={() => { handleThemeSelection(item.value); onValueChange(item.value); }}>
                                    <Text style={styles.paramGridButtonText}>{item.label}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ThemeSelector;
