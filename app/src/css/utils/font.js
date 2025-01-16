import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from './color';
import { Subtitles } from 'lucide-react-native';

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
        fontFamily: fontFamily.lobster.italic,
        color: COLORS.text.blue.dark,
        position: 'relative',
        top: '10vh',
        fontSize: isMobile ? 90 : 144,
    },
    title: {
        fontFamily: fontFamily.lobster.italic,
        textAlign: 'center',
        marginBottom: 10,
        color: COLORS.text.blue.dark,
        fontSize: isMobile ? 30 : 78,
    },
    subTitle: {
        fontFamily: fontFamily.lobster.italic,
        textAlign: 'center',
        marginBottom: 20,
        color: COLORS.text.blue.dark,
        fontSize: isMobile ? 20 : 39,
    },
    button: {
        fontFamily: fontFamily.lobster.cursive,
        fontSize: isMobile ? 25 : 30,
        color: COLORS.text.blue.dark,
        ...center,
    },
    text: {
        fontFamily: fontFamily.lobster.cursive,
        fontSize: isMobile ? 16 : 28,
        color: COLORS.text.blue.dark,
        ...center,
    },
    textAlternate: {
        marginLeft: 20,
        fontFamily: fontFamily.lobster.cursive,
        fontSize: isMobile ? 16 : 28,
        color: COLORS.text.blue.dark,
        ...center,
    },
    paragraphe: {
        fontFamily: fontFamily.arial,
        fontSize: isMobile ? 12 : 16,
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