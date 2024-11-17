import { View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react';
import { getUserInfos } from '../utils/api';
import { hasToken, removeToken } from '../utils/utils';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

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

        return (
            <View style={styles.accountView}>
                <Text>Adresse email : {userInfos.email}</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text>Se déconnecter</Text>
                </TouchableOpacity>
            </View>
        );
    } 
    else {
        return (
            <View style={styles.accountLoginView}>
                <Text>Vous n'êtes pas connecté</Text>
                <TouchableOpacity style={styles.accountLoginButton} onPress={() => navigation.navigate('login')}>
                    <Text>Se connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.accountLoginButton}onPress={() => navigation.navigate('register')}>
                    <Text>S'inscrire</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
