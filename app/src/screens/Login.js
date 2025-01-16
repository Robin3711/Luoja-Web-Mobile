import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../css/utils/color';

import GradientBackground from '../css/utils/linearGradient';

import { userLogin } from '../utils/api';
import { toast } from '../utils/utils';
import { Eye, EyeClosed } from 'lucide-react-native';
import { FONT } from '../css/utils/font';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;

export default function Login() {
    const route = useRoute();
    const navigation = useNavigation();

    let roomId = null;

    if (route.params) {
        roomId = route.params.roomId;
    }

    const passwordInputRef = useRef(null);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);

    const handleLogin = async () => {
        try {
            await userLogin(name, password);
            toast('success', "Connexion réussie !", `Bienvenue ${name}`, 3000, COLORS.toast.green);
            if (route.params && roomId != null) {
                navigation.navigate('room', { roomId: roomId });
            }
            else {
                navigation.navigate('initMenu', { screen: 'account' });
            }
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
        <GradientBackground showLogo={true}>
            <View style={styles.loginView}>
                <Text style={[FONT.title, { marginBottom: !isMobile ? 70 : 15 }]}>Connexion</Text>

                <Text style={[FONT.subTitle, { marginBottom: 5, marginTop: !isMobile ? 30 : 15 }]}>Nom d'utilisateur</Text>
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

                <Text style={[FONT.subTitle, { marginBottom: 5, marginTop: !isMobile ? 30 : 15 }]}>Mot de passe</Text>
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
                    <Text style={FONT.button}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    loginView: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    pageTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 50,
        fontWeight: 'bold',
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    inputTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    loginInput: {
        height: 40,
        width: 280,
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
});
