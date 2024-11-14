import { Text, View, TextInput, Button } from 'react-native';
import { getPlatformStyle } from "../utils/utils";
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const styles = getPlatformStyle();

export default function ResumeScreen() {
    const [gameId, setGameId] = useState('');
    const navigation = useNavigation();

    const handleResumeGame = () => {
        try
        {
            if (!gameId)
            {
                alert('Veuillez saisir un identifiant de partie');
                return;
            }
            navigation.navigate('quizScreen', { quizId: gameId });
        }
        catch (error)
        {
            console.error(error);
        }
    }
    return (
        <View style={styles.container}>
            <Text>Reprenez votre partie</Text>
            <TextInput placeholder="Identifiant de votre partie" style={styles.textInput} onChangeText={setGameId} value={gameId}/>
            <Button title="Reprendre" onPress={handleResumeGame} />
        </View>
    );
}