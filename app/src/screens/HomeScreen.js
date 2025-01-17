import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleButton from '../components/SimpleButton';
import { FONT } from '../css/utils/font';
import GradientBackground from '../css/utils/linearGradient';


const { width, height } = Dimensions.get('window');
const isMobile = width < height;

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <GradientBackground showLogo={isMobile ? true : false}>
            <View style={styles.homeView}>
                <Text style={FONT.luoja}>Luoja</Text>
                <View style={styles.childView}>
                    {!isMobile && <Image style={styles.logo} source={require('../../assets/icon.png')} />}
                    <View style={styles.listButton}>
                        <SimpleButton text="Quiz rapide" onPress={() => navigation.navigate('newQuiz')} />
                        <SimpleButton text="Quiz de la communauté" onPress={() => navigation.navigate('search')} />
                        <SimpleButton text="Reprendre la partie" onPress={() => navigation.navigate('resumeQuiz')} />
                    </View>
                    {!isMobile && <Image style={styles.logo} source={require('../../assets/icon.png')} />}
                </View>
            </View>
        </GradientBackground>
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
    },
    childView: {
        height: !isMobile ? '90%' : '75%',
        flexDirection: !isMobile ? 'row' : 'column',
        justifyContent: !isMobile ? 'flex-start' : 'center',
        alignItems: 'center',
    },
    listButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginHorizontal: 100,
        width: 650,
        height: 650,
    },
});