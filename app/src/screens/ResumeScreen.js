import { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { getGameInfos } from '../utils/api';
import { toast } from '../utils/utils';
import Toast from 'react-native-toast-message';
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
                alert('Veuillez saisir un identifiant de partie');
                setSearch(false);
                return;
            }
            let infos = getGameInfos(gameId.toLowerCase());
            infos.then(data => {
                if (data.error) {
                    alert('Aucune partie trouvée avec cet identifiant');
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
                        toast('error', error.status, error.message, 3000);
                    } else {
                        toast('error', "Erreur", error, 3000);
                    }
                });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000);
            } else {
                toast('error', "Erreur", error, 3000);
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
            <Toast/>
            <Text style={styles.title}>Reprenez votre partie</Text>
            <View style={styles.paste}>
                <TouchableOpacity onPress={handlePasteGameId}>
                    <ClipboardPaste size={20} />
                </TouchableOpacity>
                <TextInput placeholder="Identifiant de votre partie" onChangeText={setGameId} value={gameId} autoFocus />
            </View>
            <SimpleButton text={!search ? "Reprendre" : "Chargement..."} onPress={handleResumeGame} />
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
    },
    title: {
        textAlign: 'center',
        color: COLORS.text.blue.dark,
        fontSize: 50,
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    paste:{
        display:'flex',
        flexDirection:'row',
        gap:10,
    }

});