import { Text, View, TextInput, Button } from 'react-native';
import { getPlatformStyle } from "../utils/utils";
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getCurrentInfos } from '../utils/api';


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
            let infos = getCurrentInfos(gameId);
            infos.then(data => {
                if (data.error)
                {
                    alert('Aucune partie trouvée avec cet identifiant');
                    return;
                }
                else
                {
                    navigation.navigate('QuizStack', { quizData: { quizId: gameId.toLowerCase() } });
                }
            });
        }
        catch (error)
        {
            console.error(error);
        }
    }
    return (
        <View style={styles.container}>
            <Text>Reprenez votre partie</Text>
            <TextInput placeholder="Identifiant de votre partie" style={styles.textInput} onChangeText={setGameId} value={gameId} autoFocus/>
            <Button title="Reprendre" onPress={handleResumeGame} />
        </View>
    );
}