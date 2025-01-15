import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet , Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { getUserInfos } from '../utils/api';
import { hasToken } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';
import Dashboard from './Dashboard';
import SimpleButton from '../components/SimpleButton';
import GradientBackground from '../css/utils/linearGradient';



const { width  , height} = Dimensions.get('window');
const isMobile = width< height

export default function Account() {
    const navigation = useNavigation();

    const [isLogged, setIsLogged] = useState(false);
    const [userInfos, setUserInfos] = useState(null);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);

    // Vérification du token à chaque fois que l'écran est focus
    useFocusEffect(
        useCallback(() => {
            const checkToken = async () => {
                setIsLogged(await hasToken());
                setLoading(false);
            };

            checkToken();
        }, [])
    );

    // Récupération des informations utilisateur si l'utilisateur est connecté
    useEffect(() => {
        try {
            if (isLogged) {
                async function fetchUserInfos() {
                    const data = await getUserInfos();
                    setUserInfos(data);
                }
                fetchUserInfos();
            }
        } catch (err) {
            setError(true);
            setErrorMessage(err.status + " " + err.message);
        }
    }, [isLogged]);

    if (loading) {
        return <Text style={FONT.text}>Chargement...</Text>;
    }

    if (isLogged && userInfos) {

        return (
            <View style={styles.container}>
                <Dashboard />
            </View>
        );
    }
    else {
        return (
            error ? (
                <View style={styles.quizScreenView}>
                    <Text style={FONT.error}>{errorMessage}</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('initMenu', { screen: 'account' })
                    }
                    }>
                        <Text style={FONT.button}>Retour au menu</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.container}>
                    <Text style={FONT.luoja}>Luoja</Text>
                    <View style={styles.childView}>
                        <Text style={FONT.text}>Cette fonctionnalité nécessite un compte</Text>
                        <SimpleButton text="Se connecter" onPress={() => navigation.navigate('login')} />
                        <SimpleButton text="Créer un compte" onPress={() => navigation.navigate('register')} />
                    </View>
                </View>
            )
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: COLORS.background.blue,
    },
    appTitle: {
        height: !isMobile ? '10%' : '25%',
        fontSize: 150,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
    },
    childView: {
        height: !isMobile ? '90%' : '75%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
});