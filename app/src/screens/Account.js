import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { getUserInfos } from '../utils/api';
import { hasToken, loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import { Platform } from 'react-native';
import Dashboard from './Dashboard';
import SimpleButton from '../components/SimpleButton';

const platform = Platform.OS;

export default function Account() {
    const navigation = useNavigation();
    loadFont();

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
        return <Text>Chargement...</Text>;
    }

    if (isLogged && userInfos) {

        return (
            <View>
                <Dashboard />
            </View>
        );
    }
    else {
        return (
            error ? (
                <View style={styles.quizScreenView}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('menuDrawer', { screen: 'account' })
                    }
                    }>
                        <Text style={styles.buttonText}>Retour au menu</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.container}>
                    <Text style={styles.appTitle}>Luoja</Text>
                    <View style={styles.childView}>
                        <Text style={styles.optionTitle}>Cette fonctionnalité nécessite un compte</Text>
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
    appTitle:{
        height: platform === 'web' ? '10%' : '25%',
        fontSize: 150,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
    },
    childView: {
        height: platform === 'web' ? '90%' : '75%',
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