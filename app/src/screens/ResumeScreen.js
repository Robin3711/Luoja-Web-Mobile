import { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { getGameInfos } from '../utils/api';
import { toast } from '../utils/utils';
import { useNavigation } from '@react-navigation/native';
import { ClipboardPaste } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

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

    return (
        <View style={styles.container}>
            <Text>Reprenez votre partie</Text>
            <TextInput placeholder="Identifiant de votre partie" style={styles.textInput} onChangeText={setGameId} value={gameId} autoFocus />
            <TouchableOpacity onPress={handlePasteGameId}>
                <ClipboardPaste size={20} />
            </TouchableOpacity>
            <Button title={!search ? "Reprendre" : "Chargement..."} onPress={handleResumeGame} />
        </View>
    );
}

const styles = StyleSheet.create({
});