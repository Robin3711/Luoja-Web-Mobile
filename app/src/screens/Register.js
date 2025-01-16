import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userRegister } from '../utils/api';
import { toast } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import GradientBackground from '../css/utils/linearGradient';

export default function Register() {
    const route = useRoute();
    const navigation = useNavigation();

    let roomId = null;
    
    if(route.params){
        roomId = route.params.roomId;
    }

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const passwordInputRef = useRef(null);

    const handleRegister = async () => {
        try {
            if( name.length > 20 )
            {
                toast('error', 'Erreur', 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères', 3000, COLORS.toast.red);
                return;
            }
            if( name.length < 3 )
            {
                toast('error', 'Erreur', 'Le nom d\'utilisateur doit contenir au moins 3 caractères', 3000, COLORS.toast.red);
                return;
            }
            await userRegister(name, password);
            toast('success', "Enregistrement réussie !", `Nous sommes heureux de vous rencontrer ${name}`, 3000, COLORS.toast.green);
            if( route.params && roomId != null ){
                navigation.navigate('room', { roomId: roomId });
            }
            else{
                navigation.navigate('initMenu', { screen: 'account' });
            }
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.red);
            }
        }
    };

    return (
        <GradientBackground>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../assets/LogoLuojaRepete.png')} // Remplacez par le chemin de votre image
                    style={styles.image}
                />
            </View>
            <View style={styles.registerView}>
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

                <Text style={styles.inputTitle}>Mot de passe</Text>
                <View style={styles.passwordInputView}>
                    <TextInput
                        ref={passwordInputRef}
                        style={styles.registerInput}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Mot de passe"
                        secureTextEntry={true}
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                    />

                </View>

                <TouchableOpacity style={styles.buttons} onPress={handleRegister}>
                    <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        tintColor: COLORS.palette.blue.light,
        opacity: 0.35,
    },
    registerView: {
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