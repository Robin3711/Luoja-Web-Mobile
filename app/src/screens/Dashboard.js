import { View, Text } from "react-native";
import { hasToken, removeToken } from "../utils/utils";
import { getPlatformStyle } from "../utils/utils";
import { Button } from "react-native-web";
import { useNavigation } from "@react-navigation/native";

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
            <Button title="Se déconnecter" onPress={handleLogout} />
        </View>
    );
}