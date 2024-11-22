import { View, Text, ScrollView } from "react-native";
import { hasToken, removeToken } from "../utils/utils";
import { getPlatformStyle } from "../utils/utils";
import { Button } from "react-native-web";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

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

    // Récupération de l'historique et des quiz publiés
    useEffect(() => {
        async function fetchDashboardData() {
            // Récupération de l'historique
            const historyData = await getUserGame();
            setHistory(historyData);

            // Récupération des quiz publiés
            // const publishedQuizzesData = await getPublishedQuizzes();
            // setPublishedQuizzes(publishedQuizzesData);
        }

        fetchDashboardData();
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
                                <Text>{item}</Text>
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