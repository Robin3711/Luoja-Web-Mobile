import { View, Text } from "react-native";
import { hasToken, removeToken } from "../utils/utils";
import { getPlatformStyle } from "../utils/utils";
import { Button } from "react-native-web";
import { useNavigation } from "@react-navigation/native";
import VerticalDivider from '../components/Divider';

const styles = getPlatformStyle();

export default function Dashboard() {
    const navigation = useNavigation();

    if(!hasToken()){
        navigation.navigate('login');
    }

    const handleLogout = async () => {
        await removeToken();
        navigation.navigate('login');
    }

    return (
        <View style={styles.dashboardView}>
            <Text style={styles.dashboardText   }>Tableau de bord</Text>
            <View style={styles.dashboardContainer}>
                <View style={styles.section}>
                    <Text>Section 1</Text>
                </View>
                <VerticalDivider />
                <View style={styles.section}>
                    <Text>Section 2</Text>
                </View>
            </View>
            <Button title="Se déconnecter" onPress={handleLogout} />
        </View>
    );
}