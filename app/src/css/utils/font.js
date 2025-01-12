import { StyleSheet } from 'react-native';
import { COLORS } from './color';

const fontFamily = {
    arial: 'Arial',
    lobster: {
        cursive: 'LobsterTwo_400Regular',
        italic: 'LobsterTwo_700Bold_Italic',
    }
};

// Fonction utilitaire pour centrer
const center = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

// Styles des polices
export const FONT = StyleSheet.create({
    luoja: {
        fontFamily: fontFamily.lobster.cursive,
        color: COLORS.text.blue.dark,
        position: 'fixed',
        top: '2vh',
        fontSize: 36, 
        fontWeight: 'bold',
    },
    title: {
        fontFamily: fontFamily.lobster.italic,
        textAlign: 'center',
        marginBottom: 10,
        color: COLORS.text.blue.dark,
        fontSize: 24,
    },
    button: {
        fontFamily: fontFamily.lobster.cursive,
        fontSize: 20, // Taille en nombre
        color: COLORS.text.blue.dark,
        ...center,
    },
    text: {
        fontFamily: fontFamily.lobster.cursive,
        fontSize: 16,
        color: COLORS.text.blue.dark,
        ...center,
    },
    paragraph: {
        fontFamily: fontFamily.arial,
        fontSize: 14,
        color: COLORS.text.blue.dark,
        textAlign: 'center',
        ...center,
    },
    textInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        ...center,
    },
    error: {
        fontSize: 14,
        color: 'red',
        ...center,
    },
});
