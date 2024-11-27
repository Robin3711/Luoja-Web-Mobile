import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { userLogin } from '../utils/api';

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
            <Text style={styles.pageTitle}>Connexion</Text>

            <Text style={styles.inputTitle}>Nom d'utilisateur</Text>
            <View style={styles.nameInputView}>
                <TextInput
                    style={styles.loginInput}
                    onChangeText={setName}
                    value={name}
                    placeholder="Nom d'utilisateur"
                    autoFocus={true}
                />
            </View>

            <Text style={styles.inputTitle}>Password</Text>
            <View style={styles.passwordInputView}>
                <TextInput
                    style={styles.loginInput}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry={true}
                />
            </View>

            <TouchableOpacity style={styles.buttons} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loginView: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 40,
        fontWeight: 'bold',
    },
    inputTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    loginInput: {
        height: 40,
        width: 250,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'white',
    },
    nameInputView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#58bdfe',
    },
    passwordInputView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        borderRadius: 20,
        backgroundColor: '#4d65b4',
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