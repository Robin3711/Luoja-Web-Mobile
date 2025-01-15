import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';

import { userLogin } from '../utils/api';
import { toast } from '../utils/utils';
import { Eye, EyeClosed } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;

export default function Login() {

    const navigation = useNavigation();

    const passwordInputRef = useRef(null);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);

    const handleLogin = async () => {
        try {
            await userLogin(name, password);
            toast('success', "Connexion réussie !", `Bienvenue ${name}`, 3000, COLORS.toast.green);
            navigation.navigate('initMenu', { screen: 'account' });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.red);
            } else {
                toast('error', 'Erreur', error, 3000, COLORS.toast.red);
            }
        }
    };

    const handleHidePassword = () => {
        setHidePassword(!hidePassword);
    }

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
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        if (passwordInputRef.current) {
                            passwordInputRef.current.focus();
                        }
                    }}
                />
            </View>

            <Text style={styles.inputTitle}>Mot de passe</Text>
            <View style={styles.passwordInputView}>
                <TextInput
                    ref={passwordInputRef}
                    style={styles.loginInput}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Mot de passe"
                    secureTextEntry={hidePassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                />

                <TouchableOpacity onPress={handleHidePassword} style={styles.iconButton}>
                    {hidePassword ? (
                        <EyeClosed size={30} color="white" />
                    ) : (
                        <Eye size={30} color="white" />
                    )}
                </TouchableOpacity>
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
        padding: 10,
        backgroundColor: COLORS.background.blue,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 1,
        borderRadius: 20,
        backgroundColor: '#4d65b4',
        width: !isMobile ? 300 : 320,
    },
    iconButton: {
        paddingRight: 10,
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
