import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { userLogin } from '../utils/api';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();


export default function Login() {

    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await userLogin(name, password);
            navigation.navigate('menuDrawer', { screen: 'account' });
        }
        catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.loginView}>
            <Text>Nom d'utilisateur</Text>
            <TextInput
                style={styles.loginInput}
                onChangeText={setName}
                value={name}
                placeholder="Nom d'utilisateur"
                autoFocus={true}
            />
            <Text>Mot de passe</Text>
            <TextInput
                style={styles.loginInput}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text>Se connecter</Text>
            </TouchableOpacity>
        </View>
    );
}