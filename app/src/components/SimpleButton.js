import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';

const platform = Platform.OS;

export default function SimpleButton({ text, onPress, color = COLORS.button.blue.basic, height = 75, width = 350, textStyle = {} }) { 
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color, height: height, width: width }]} >
            <Text style={[FONT.button, textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'relative', // Permet de positionner le texte absolument par rapport au bouton
        backgroundColor: COLORS.button.blue.basic,
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 25,
        ...platform === 'web' ? {
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
        } : { elevation: 2 },
    },
});