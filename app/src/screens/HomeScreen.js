import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPlatformStyle } from '../utils/utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import HomeScreenButtons from '../components/HomeScreenButtons';

const styles = getPlatformStyle();

export default function HomeScreen() {

    const navigation = useNavigation();
    
    return (
        <View style={styles.homeScreen}>
            <View>
                <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
                    <Feather name="menu" size={50} color="black"/>
                </TouchableOpacity>
            </View>
            <HomeScreenButtons/>
        </View>
    );
}