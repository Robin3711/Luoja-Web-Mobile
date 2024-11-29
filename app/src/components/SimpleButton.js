import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';

const platform = Platform.OS;

export default function SimpleButton({ text, onPress }) {
    loadFont();
    
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'relative', // Permet de positionner le texte absolument par rapport au bouton
        backgroundColor: COLORS.button.blue.basic,
        height: 75,
        width: 350,
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 25,
        ...platform === 'web' ? { 
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
        } : { elevation: 2 },
    },
    text: {
        position: 'absolute', // Positionne le texte absolument par rapport au bouton
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centre le texte horizontalement et verticalement
        width: '100%',
        fontSize: 32,
        fontFamily: 'LobsterTwo_700Bold',
        textAlign: 'center', // Centre le texte horizontalement
        color: COLORS.text.blue.dark,
    },
});