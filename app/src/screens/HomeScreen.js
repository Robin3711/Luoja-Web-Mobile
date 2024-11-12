import { View } from 'react-native';
import { getPlatformStyle } from '../utils/utils';

import HomeScreenButtons from '../components/HomeScreenButtons';

const styles = getPlatformStyle();

export default function HomeScreen() {
    return (
        <View style={styles.homeScreen}>
            <HomeScreenButtons/>
        </View>
    );
}