import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Platform, StyleSheet, ScrollView } from 'react-native';
import { Dices } from 'lucide-react-native';

import { themeOptions, iconSize } from '../utils/utils';

const platform = Platform.OS;

const ThemeSelector = ({ onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenModal = () => {
        setModalVisible(true);
    }

    const handleThemeSelection = (theme) => {
        setModalVisible(false);
        onValueChange(theme);
    };

    return (
        <View style={styles.themeListView}>
            <TouchableOpacity style={styles.paramButton} onPress={handleOpenModal}><Text>Choisir un thème</Text></TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.themeListModal}>
                    <TouchableOpacity
                        style={styles.defaultThemeButton}
                        onPress={() => handleThemeSelection('none')}>
                        <Text style={styles.themeLabel}><Dices color="black" size={iconSize} /> Thème générale</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={themeOptions}
                        keyExtractor={(item) => item.label}
                        numColumns={platform === 'web' ? 3 : 1}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.themeButton}
                                onPress={() => handleThemeSelection(item.value)}
                            >
                                <Text style={styles.themeLabel}>{item.icon}{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.themeList}
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
        marginBottom: 10,
    },
    paramButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    themeListModal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        marginHorizontal: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    defaultThemeButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    themeButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        width: platform === 'web' ? 350 : '100%',  
        height: 50,
    },
    themeLabel: {
        fontSize: 16,
    },
});

export default ThemeSelector;
