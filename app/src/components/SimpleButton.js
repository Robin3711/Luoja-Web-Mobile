import { Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';

const platform = Platform.OS;
const { width } = Dimensions.get('window');
const isMobile = width < 775;

export default function SimpleButton({
    text,
    onPress,
    color = COLORS.button.blue.basic,
    height = isMobile ? 50 : 75,
    width = isMobile ? 250 : 350,
    textStyle = {}
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor: color, minHeight: height, width }]}
        >
            <Text style={[FONT.button, styles.buttonText, textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'relative',
        backgroundColor: COLORS.button.blue.basic,
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 25,
        justifyContent: 'center', // Centre le contenu verticalement
        alignItems: 'center',    // Centre le contenu horizontalement
        paddingVertical: 10, // Ajoute du padding vertical pour ajuster la hauteur
        ...platform === 'web'
            ? {
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
            }
            : {
                elevation: 2, // Ombres pour Android
                shadowColor: '#000', // Ombres pour iOS
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.25,
                shadowRadius: 1,
            },
    },
    buttonText: {
        textAlign: 'center',
        flexWrap: 'wrap', // Permet au texte de passer à la ligne si nécessaire
    },
});