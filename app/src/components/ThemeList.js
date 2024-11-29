import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Platform, StyleSheet, ScrollView } from 'react-native';
import { Dices } from 'lucide-react-native';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';

import { themeOptions, iconSize } from '../utils/utils';

const platform = Platform.OS;

const ThemeSelector = ({ onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [theme, setTheme] = useState("Choisir un thème");

    const handleOpenModal = () => {
        setModalVisible(true);
    }

    const handleThemeSelection = (theme) => {
        setModalVisible(false);
        onValueChange(theme);
    };


    return (
        <View style={styles.themeListView}>
            <TouchableOpacity style={styles.paramButton} onPress={handleOpenModal}><Text style={styles.paramButtonText}>{theme}</Text></TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.themeListModal}>
                    <TouchableOpacity
                        style={styles.themeButton}
                        onPress={() => handleThemeSelection('none')}>
                        <Text style={[styles.themeLabel, {fontWeight:'bold'}]}><Dices color="black" size={iconSize} /> Thème générale</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={themeOptions}
                        keyExtractor={(item) => item.label}
                        numColumns={platform === 'web' ? 3 : 1}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.themeButton}
                                onPress={() => { handleThemeSelection(item.value), setTheme(item.label) }}
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
    },
    paramButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#58BDFE',
        width: platform === 'web' ? 750 : '100%',
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
        marginVertical: '20%',
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

export default ThemeSelector;
