import { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { getGameInfos } from '../utils/api';
import { toast } from '../utils/utils';
import { useNavigation } from '@react-navigation/native';
import { ClipboardPaste } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

import { COLORS } from '../css/utils/color';
import { loadFont } from '../utils/utils';
import SimpleButton from '../components/SimpleButton';

const platform = Platform.OS;

export default function ResumeScreen() {
    const [gameId, setGameId] = useState('');
    const [search, setSearch] = useState(false);
    const navigation = useNavigation();

    const handleResumeGame = () => {
        try {
            setSearch(true);
            if (!gameId) {
                toast('error', 'Erreur', 'Veuillez saisir un identifiant de partie', 3000, 'crimson');
                setSearch(false);
                return;
            }
            let infos = getGameInfos(gameId.toLowerCase());
            infos.then(data => {
                if (data.error) {
                    toast('error', 'Erreur', 'Aucune partie trouvée avec cet identifiant', 3000, 'crimson');
                    setSearch(false);
                    return;
                }
                else {
                    setSearch(false);
                    navigation.navigate('quizScreen', { gameId: gameId.toLowerCase() });
                }
            })
                .catch(error => {
                    if (error.status && error.message) {
                        toast('error', error.status, error.message, 3000, 'crimson');
                    } else {
                        toast('error', "Erreur", error, 3000, 'crimson');
                    }
                });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'crimson');
            } else {
                toast('error', "Erreur", error, 3000, 'crimson');
            }
        }
    }

    const handlePasteGameId = async () => {
        const idOfGame = await Clipboard.getStringAsync();
        setGameId(idOfGame);
    };

    loadFont();
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Reprenez votre partie</Text>
            <View style={styles.paste}>
                <TouchableOpacity onPress={handlePasteGameId}>
                    <ClipboardPaste size={20} style={styles.pasteButton} />
                </TouchableOpacity>
                <TextInput placeholder="Identifiant de votre partie" onChangeText={setGameId} value={gameId} autoFocus style={styles.input} />
            </View>
            <SimpleButton text={!search ? "Reprendre" : "Chargement..."} onPress={handleResumeGame} style={styles.button} />
        </View>
    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background.blue,
        padding: 20, 
    },
    title: {        
        textAlign: 'center',
        color: COLORS.text.blue.dark,
        fontSize: 60, 
        fontFamily: 'LobsterTwo_700Bold_Italic',
        marginHorizontal: 20,
        marginBottom: 150,
        marginTop: -25,
    },
    paste: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, 
        borderBottomWidth: 2,        
        paddingHorizontal: 10,
    },
    pasteButton: {
        padding: 10, 
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 30,
        color: COLORS.text.blue.dark,
        borderRadius: 5,    
        marginBottom: 20,    
    },
    button: {
        backgroundColor: COLORS.button.blue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,        
    },    
});