import { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';

import { getGameInfos } from '../utils/api';
import { useNavigation } from '@react-navigation/native';

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
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <View style={styles.container}>
            <Text>Reprenez votre partie</Text>
            <TextInput placeholder="Identifiant de votre partie" style={styles.textInput} onChangeText={setGameId} value={gameId} autoFocus />
            <Button title={!search ? "Reprendre" : "Chargement..."} onPress={handleResumeGame} />
        </View>
    );
}

const styles = StyleSheet.create({
});