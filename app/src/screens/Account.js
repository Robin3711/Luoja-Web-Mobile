import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { getUserInfos } from '../utils/api';
import { hasToken, removeToken } from '../utils/utils';
import { Platform } from 'react-native';
import Dashboard from './Dashboard';

const platform = Platform.OS;

export default function Account() {
    const navigation = useNavigation();

    const [isLogged, setIsLogged] = useState(false);
    const [userInfos, setUserInfos] = useState(null);

    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        await removeToken();
        setIsLogged(false);
    }

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
        if (isLogged) {
            async function fetchUserInfos() {
                const data = await getUserInfos();
                setUserInfos(data);
            }
            fetchUserInfos();
        }
    }, [isLogged]);

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    if (isLogged && userInfos) {

        return(
            <View>
                <Dashboard />
            </View>
        );
    }
    else {
        return (
            <View style={styles.firstLaunchView}>
                <Text style={styles.appTitle}>Luoja</Text>
                <View style={styles.optionsView}>
                    <View style={styles.leftView}>
                        <Text style={styles.optionTitle}>Connectez vous !</Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('login')}} style={styles.buttons}>
                            <Text style={styles.buttonText}>Se connecter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {navigation.navigate('register')}} style={styles.buttons}>
                            <Text style={styles.buttonText}>Créer un compte</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.orText}>Ou</Text>
                    <View style={styles.rightView}>
                        <Text style={styles.optionTitle}>Continuez en tant qu'invité</Text>
                        <TouchableOpacity style={styles.buttons}>
                            <Text style={styles.buttonText}>Invité</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    firstLaunchView: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 60,
        fontWeight: 'bold',
    },
    orText:{
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: platform === 'web' ? 0 : 15,
    },
    optionsView: {
        display: 'flex',
        flexDirection: platform === 'web' ? 'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '75%',
    },
    optionTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    leftView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '45%',
    },
    rightView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '45%',
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