import { Text, View, TextInput, Button } from 'react-native';
import { getPlatformStyle } from "../utils/utils";
import { getCurrentInfos } from "../utils/api";
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const styles = getPlatformStyle();

export default function ResumeScreen() {
    const [gameId, setGameId] = useState('');
    const navigation = useNavigation();

    const handleResumeGame = () => {
        try
        {
            navigation.navigate('QuizStack', { quizData: { quizId: gameId } });

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