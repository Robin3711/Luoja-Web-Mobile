import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';

const platform = Platform.OS;

export default function SimpleButton({
    text,
    onPress,
    color = COLORS.button.blue.basic,
    height = 75,
    width = 350,
    textStyle = {}
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor: color, height, width }]}
        >
            <Text style={[FONT.button, { textAlign: 'center' }, textStyle]}>{text}</Text>
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
});
