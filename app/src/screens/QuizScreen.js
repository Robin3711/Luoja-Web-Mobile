import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function QuizScreen() {
    const route = useRoute();
    const { quizData } = route.params;
    const quizId = quizData.quizId;

    return (
        <View>
            <Text>Résultats du Quiz</Text>
            <Text>Quiz ID: {quizId}</Text>
        </View>
    );
}
