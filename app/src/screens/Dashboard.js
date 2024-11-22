import { View, Text, ScrollView } from "react-native";
import { hasToken, removeToken } from "../utils/utils";
import { getPlatformStyle } from "../utils/utils";
import { Button } from "react-native-web";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getUserGame } from "../utils/api";
import HistoryQuizInformation from "../components/HistoryQuizInformation";
const styles = getPlatformStyle();

export default function Dashboard() {
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);
    const [publishedQuizzes, setPublishedQuizzes] = useState([]);

    if(!hasToken()){
        navigation.navigate('login');
    }

    const handleLogout = async () => {
        await removeToken();
        navigation.navigate('login');
    }

    useEffect(() => {
        if (!hasToken()) {
            navigation.navigate('login');
        }
    }
    , []);

    useEffect(() => {
        async function fetchHistory() {
            const data = await getUserGame();
            setHistory(data.games);
        }
        fetchHistory();
    }, []);
    

    return (
        <View style={styles.dashboardView}>
            <Text style={styles.dashboardText   }>Tableau de bord</Text>
            <View style={styles.dashboardContainer}>
                <View style={styles.dashboardSection}>
                    <Text>Historique</Text>
                    <ScrollView>
                        {history.map((item, index) => (
                            <View key={index}>
                                <HistoryQuizInformation partyId={item.id} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.dashboardSection}>
                    <Text>Vos quiz publié</Text>
                    <ScrollView>
                        {publishedQuizzes.map((item, index) => (
                            <View key={index}>
                                <Text>{item}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <Button title="Se déconnecter" onPress={handleLogout} />
        </View>
    );
}