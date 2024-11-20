import { View, Text } from "react-native";
import { hasToken, removeToken } from "../utils/utils";
import { getPlatformStyle } from "../utils/utils";

const styles = getPlatformStyle();

export default function Dashboard() {

    if(!hasToken()){
        navigation.navigate('login');
    }

    return (
        <View>
            <Text>Dashboard</Text>
        </View>
    );
}