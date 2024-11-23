import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getPlatformStyle } from "../utils/utils";

const styles = getPlatformStyle();


export default function HomeScreenButtons() {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.homeScreenButtonsView}>
                <TouchableOpacity style={styles.homeScreenButton} onPress={() => navigation.navigate('newQuiz')}>
                    <Text>Créer un QUIZ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.homeScreenButton} onPress={() => navigation.navigate('resumeQuiz')}>
                    <Text>Reprendre un QUIZ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}