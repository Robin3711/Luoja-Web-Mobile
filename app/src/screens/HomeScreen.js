import { View, Text, Platform, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleButton from '../components/SimpleButton';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';

const platform = Platform.OS;

export default function HomeScreen() {
    const navigation = useNavigation();
    loadFont();

    return (
        <View style={styles.homeView}>
            <Text style={[FONT.title, {fontFamily:'LobsterTwo_700Bold_Italic'}]}>Luoja</Text>

            {platform === 'web' && <Image source={require('../../assets/splash.png')} />}

            <View style={styles.listButton}>
                <SimpleButton text="Générer un Quiz" onPress={() => navigation.navigate('newQuiz')}/>

                <SimpleButton text="Quiz de la communauté" onPress={() => navigation.navigate('search')} />

                <SimpleButton text="Reprendre la partie" onPress={() => navigation.navigate('resumeQuiz')} />
            </View>

            {platform === 'web' && <Image source={require('../../assets/splash.png')} />}
        </View>
    );
}

const styles = StyleSheet.create({
    homeView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.background.blue,
        color: COLORS.text.blue.dark,
    },
    listButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});