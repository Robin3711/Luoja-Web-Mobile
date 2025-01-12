import { View, Text, Platform, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleButton from '../components/SimpleButton';
import { COLORS } from '../css/utils/color';

import { FONT } from '../css/utils/font';

const platform = Platform.OS;

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.homeView}>

            <Text style={FONT.luoja}>Luoja</Text>

            <View style={styles.childView}>
                {platform === 'web' && <Image style={styles.logo} source={"https://static.vecteezy.com/system/resources/previews/033/529/199/non_2x/christmas-tree-with-gifts-ai-generative-free-png.png"} />}

                <View style={styles.listButton}>
                    <SimpleButton text="Quiz rapide" onPress={() => navigation.navigate('newQuiz')} />

                    <SimpleButton text="Quiz de la communauté" onPress={() => navigation.navigate('search')} />

                    <SimpleButton text="Reprendre la partie" onPress={() => navigation.navigate('resumeQuiz')} />
                </View>

                {platform === 'web' && <Image style={styles.logo} source={"https://static.vecteezy.com/system/resources/previews/033/529/199/non_2x/christmas-tree-with-gifts-ai-generative-free-png.png"} />}
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