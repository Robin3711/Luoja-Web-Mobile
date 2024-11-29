import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { userRegister } from '../utils/api';
import { toast } from '../utils/utils';

export default function Register() {

    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const passwordInputRef = useRef(null);

    const handleRegister = async () => {
        try {
            await userRegister(name, password);
            navigation.navigate('menuDrawer', { screen: 'account' });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, 'red');
            } else {
                toast('error', "Erreur", error, 3000, 'red');
            }
        }
    };

    return (
        <View style={styles.registerView}>
            <Toast />
            <Text style={styles.pageTitle}>Inscription</Text>

            <Text style={styles.inputTitle}>Nom d'utilisateur</Text>
            <View style={styles.nameInputView}>
                <TextInput
                    style={styles.registerInput}
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

            <Text style={styles.inputTitle}>Password</Text>
            <View style={styles.passwordInputView}>
                <TextInput
                    ref={passwordInputRef}
                    style={styles.registerInput}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry={true}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                />

            </View>

            <TouchableOpacity style={styles.buttons} onPress={handleRegister}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    registerView: {
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
    registerInput: {
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