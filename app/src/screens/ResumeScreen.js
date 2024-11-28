import { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Platform } from 'react-native';

import { getGameInfos } from '../utils/api';
import { toast } from '../utils/utils';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

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
    return (
        <View style={styles.container}>
            <Toast ref={(ref) => Toast.setRef(ref)} />
            <Text>Reprenez votre partie</Text>
            <TextInput placeholder="Identifiant de votre partie" style={styles.textInput} onChangeText={setGameId} value={gameId} autoFocus />
            <Button title={!search ? "Reprendre" : "Chargement..."} onPress={handleResumeGame} />
        </View>
    );
}

const styles = StyleSheet.create({
});