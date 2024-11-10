import { getPlatformStyle } from "../utils/utils";
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const styles = getPlatformStyle();

export default function HomeScreenButtons() {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <View>
                    <Text>Home Screen</Text>
                </View>
            </View>
        </View>
    );
}