import { View, Text,  Dimensions, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleButton from '../components/SimpleButton';
import { COLORS } from '../css/utils/color';

import { FONT } from '../css/utils/font';


const { width  , height} = Dimensions.get('window');
const isMobile = width< height

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
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
        marginHorizontal: 200,
        width: 500,
        height: 700,
    },
});