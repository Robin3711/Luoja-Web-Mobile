import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function DrawerButton() {

    const navigation = useNavigation();

    return (
        <View style={styles.drawerButtonView}>
            <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
                <Feather name="menu" size={50} color="black"/>
            </TouchableOpacity>
        </View>
    );
}