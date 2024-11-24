import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.homeView}>
            <Text style={styles.appTitle}>Luoja</Text>
            <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('newQuiz')}>
                <Text style={styles.buttonText}>Générer un Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('search')}>
                <Text style={styles.buttonText}>Quiz de la communauté</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('resumeQuiz')}>
                <Text style={styles.buttonText}>Reprendre la partie</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    homeView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    appTitle: {
        position: 'absolute',
        top: 100,
        fontSize: 50,
        fontWeight: 'bold',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8fd3ff',
        height: 50,
        width: 250,
        borderRadius: 15,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});