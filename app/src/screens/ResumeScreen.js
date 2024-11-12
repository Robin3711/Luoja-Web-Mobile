import { Text, View, TextInput, Button } from 'react-native';
import { getPlatformStyle } from "../utils/utils";
import { getCurrentInfos } from "../utils/api";
import { useState } from 'react';

const styles = getPlatformStyle();

export default function ResumeScreen() {
    const [gameId, setGameId] = useState('');

    const handleResumeGame = () => {
        try
        {
            const infos = getCurrentInfos(gameId);
            //navigation.navigate('QuizStack', { quizData: { quizId: gameId, questionCursor: infos.questionCursor } });

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