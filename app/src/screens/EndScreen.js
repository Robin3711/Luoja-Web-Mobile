import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function EndScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { resumeData } = route.params;
    const score = resumeData.score;
    const gameId = resumeData.gameId;

    const handleReturnHome = () => {
        navigation.navigate("menuDrawer");
    };

    const handleReplay = () => {
        navigation.navigate('quizScreen', { quizData: { quizId: gameId } });
    };

    return (
        <View style={styles.quizContainer}>
            <View style={styles.quizQuestionContainer}>
                <Text> Fin de partie !</Text>
                <Text>Votre score : {score} </Text>
            </View>

            <TouchableOpacity
                style={styles.quizNextButton}
                onPress={() => {
                    handleReturnHome();
                }}
            >
                <Text style={styles.quizNextButtonText}>
                    Retourner au Menu.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.quizNextButton}
                onPress={() => {
                    handleReplay();
                }}
            >
                <Text style={styles.quizNextButtonText}>
                    Rejouer au même quiz.
                </Text>
            </TouchableOpacity>
        </View>

    );
}
