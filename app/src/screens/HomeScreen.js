import { View, Text, Platform, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleButton from '../components/SimpleButton';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';

const platform = Platform.OS;

export default function HomeScreen() {
    const navigation = useNavigation();

    loadFont();

    return (
        <View style={styles.homeView}>

            <Text style={styles.appTitle}>Luoja</Text>

            <View style={styles.childView}>
                {platform === 'web' && <Image style={styles.logo} source={require('../../assets/icon.png')} />}

                <View style={styles.listButton}>
                    <SimpleButton text="Quiz rapide" onPress={() => navigation.navigate('newQuiz')} />

                    <SimpleButton text="Quiz de la communauté" onPress={() => navigation.navigate('search')} />

                    <SimpleButton text="Reprendre la partie" onPress={() => navigation.navigate('resumeQuiz')} />
                </View>

                {platform === 'web' && <Image style={styles.logo} source={require('../../assets/icon.png')} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    homeView: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: COLORS.background.blue,
    },
    appTitle: {
        height: platform === 'web' ? '10%' : '25%',
        fontSize: 150,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
    },
    childView: {
        height: platform === 'web' ? '90%' : '75%',
        flexDirection: platform === 'web' ? 'row' : 'column',
        justifyContent: platform === 'web' ? 'flex-start' : 'center',
        alignItems: 'center',
    },
    listButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginHorizontal: 200,
        width: 500,
        height: 700,
    },
});