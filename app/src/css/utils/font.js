import { StyleSheet, Dimensions, Platform } from 'react-native';
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

const { width } = Dimensions.get('window');
const isMobile = width < 775;

// Styles des polices
export const FONT = StyleSheet.create({
    luoja: {
        fontFamily: fontFamily.lobster.cursive,
        color: COLORS.text.blue.dark,
        position: 'relative',
        top: '10vh',
        fontSize: isMobile ? 72 : 144, 
        fontWeight: 'bold',
    },
    title: {
        fontFamily: fontFamily.lobster.italic,
        textAlign: 'center',
        marginBottom: 10,
        color: COLORS.text.blue.dark,
        fontSize: isMobile ? 30 : 78,
    },
    button: {
        fontFamily: fontFamily.lobster.cursive,
        fontSize: 30,
        color: COLORS.text.blue.dark,
        ...center,
    },
    text: {
        fontFamily: fontFamily.lobster.cursive,
        fontSize: isMobile ? 12 : 16,
        color: COLORS.text.blue.dark,
        ...center,
    },
    paragraphe: {
        fontFamily: fontFamily.arial,
        fontSize: isMobile ? 16 : 22,
        color: COLORS.text.blue.dark,
        textAlign: 'center',
        ...center,
    },
    textInput: {
        flex: 1,
        height: isMobile ? 40 : 50,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        ...center,
    },
    error: {
        fontSize: isMobile ? 12 : 14,
        color: 'red',
        ...center,
    },
});