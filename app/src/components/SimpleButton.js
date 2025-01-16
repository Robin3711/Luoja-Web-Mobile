import { Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, View } from 'react-native';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';


const { width, height } = Dimensions.get('window');
const isMobile = width < height;


export default function SimpleButton({
    text,
    onPress,
    color = COLORS.button.blue.basic,
    height = isMobile ? 50 : 75,
    width = isMobile ? 250 : 350,
    textStyle = {},
    disabled,
    marginVertical = 10,
    marginBottom = 25,
    paddingVertical = 10,
    loading = false,
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor: color, minHeight: height, width, marginVertical, marginBottom, paddingVertical, backgroundColor: disabled ? COLORS.button.disabled : COLORS.button.blue.basic }]}
            disabled={disabled}
        >
            <View style={styles.elements} >
                <Text style={[FONT.button, styles.buttonText, textStyle]}>{text}</Text>
                {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginLeft: 10 }} />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'relative',
        borderRadius: 15,
        justifyContent: 'center', // Centre le contenu verticalement
        alignItems: 'center',    // Centre le contenu horizontalement
        ...!isMobile
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
    elements: {
        display: 'flex',
        flexDirection: 'row',

    }
});