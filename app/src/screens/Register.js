import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userRegister } from '../utils/api';
import { toast } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import { Eye, EyeClosed } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;
import GradientBackground from '../css/utils/linearGradient';
import { FONT } from '../css/utils/font';

export default function Register() {
    const route = useRoute();
    const navigation = useNavigation();

    let roomId = null;

    if (route.params) {
        roomId = route.params.roomId;
    }

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);

    const passwordInputRef = useRef(null);

    const handleRegister = async () => {
        try {
            if (name.length > 20) {
                toast('error', 'Erreur', 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères', 3000, COLORS.toast.red);
                return;
            }
            if (name.length < 3) {
                toast('error', 'Erreur', 'Le nom d\'utilisateur doit contenir au moins 3 caractères', 3000, COLORS.toast.red);
                return;
            }
            await userRegister(name, password);
            toast('success', "Enregistrement réussie !", `Nous sommes heureux de vous rencontrer ${name}`, 3000, COLORS.toast.green);
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
                toast('error', "Erreur", error, 3000, COLORS.toast.red);
            }
        }
    };

    const handleHidePassword = () => {
        setHidePassword(!hidePassword);
    }

    return (
        <GradientBackground>
            <View style={styles.registerView}>
                <Text style={[FONT.title, { marginBottom: !isMobile ? 70 : 15 }]}>Inscription</Text>

                <Text style={[FONT.subTitle, { marginBottom: 5, marginTop: !isMobile ? 30 : 15 }]}>Nom d'utilisateur</Text>
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

                <Text style={[FONT.subTitle, { marginBottom: 5, marginTop: !isMobile ? 30 : 15 }]}>Mot de passe</Text>
                <View style={styles.passwordInputView}>
                    <TextInput
                        ref={passwordInputRef}
                        style={styles.registerInput}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Mot de passe"
                        secureTextEntry={hidePassword}
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                    />
                    <TouchableOpacity onPress={handleHidePassword} style={styles.iconButton}>
                        {hidePassword ? (
                            <EyeClosed size={30} color="white" />
                        ) : (
                            <Eye size={30} color="white" />
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.buttons} onPress={handleRegister}>
                    <Text style={FONT.button}>S'inscrire</Text>
                </TouchableOpacity>
            </View>

        </GradientBackground >
    );
}

const styles = StyleSheet.create({
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
        fontSize: 50,
        fontWeight: 'bold',
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    inputTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    registerInput: {
        height: 40,
        width: Platform.OS === 'web' ? "100%" : 250,
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
        width: !isMobile ? 300 : 320,
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