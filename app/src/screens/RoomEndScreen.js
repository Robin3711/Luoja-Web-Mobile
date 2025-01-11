import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import { getRoomScores } from '../utils/api';

export default function EndScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    loadFont();

    const { roomId } = route.params;

    const [scores, setScores] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const data = await getRoomScores(roomId);

                const scores = data.scores;

                setScores(scores);

                setLoading(false);
            } catch (err) {
                setError(true);
                setErrorMessage(err.status + " " + err.message);
            }
        };

        loadGameData();
    }, [roomId]);

    const handleReturnHome = async () => {
        navigation.navigate("initMenu");
    };


    return (error ? (
        <View style={styles.container}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate('initMenu')
            }
            }>
                <Text style={styles.buttonText}>Retour au menu</Text>
            </TouchableOpacity>
        </View>
    ) : (
        <View style={styles.container}>
            <View style={styles.parentContainer}>
                <Text style={styles.title}>Fin de partie !</Text>
                <Text style={styles.text}>Récapitulatif de la partie :</Text>
                {scores !== null ? (
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreTitle}>Scores :</Text>
                        {scores.map((score, index) => (
                            <Text key={index} style={styles.text}>
                                {score.userName} : {score.score}
                            </Text>
                        ))}
                    </View>
                ) : (
                    <Text>Chargement du score...</Text>
                )}
            </View>

            <SimpleButton
                text="Retourner au menu"
                onPress={handleReturnHome}
            />
        </View>
    )
    );
}

const styles = StyleSheet.create({
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        backgroundColor: COLORS.background.blue,
    },
    parentContainer: {
        alignItems: 'center',
        margin: 20,
    },
    scoreContainer: {
        alignItems: 'center',
        margin: 20,
    },
    title: {
        textAlign: 'center',
        color: COLORS.text.blue.dark,
        fontSize: 50,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        width: '100%',
        marginBottom: '25%',
    },
    text: {
        fontSize: 25,
        color: COLORS.text.blue.dark,
    },
    scoreTitle: {
        fontSize: 25,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
    },
    wheelContainer: {
        margin: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});