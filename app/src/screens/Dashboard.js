import { View, Text, ScrollView } from "react-native";
import { hasToken, removeToken } from "../utils/utils";
import { getPlatformStyle } from "../utils/utils";
import { Button } from "react-native-web";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getUserGame, getCreatedQuiz } from "../utils/api";
import HistoryQuizInformation from "../components/HistoryQuizInformation";
import CreatedQuizInformation from "../components/CreatedQuizInformation";
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
        async function fetchData() {
            const games = await getUserGame();
            const quizzes = await getCreatedQuiz();
            console.log(quizzes);
            setHistory(games.games);
            setPublishedQuizzes(quizzes.quizs);
        }
        fetchData();
    }, []);
    

    return (
        <View style={styles.dashboardView}>
            <Text style={styles.dashboardText   }>Tableau de bord</Text>
            <View style={styles.dashboardContainer}>
                <View style={styles.dashboardSection}>
                    <Text style={styles.dashboardText   }>Historique</Text>
                    <ScrollView>
                        {history.map((item, index) => (
                            <View key={index}>
                                <HistoryQuizInformation partyId={item.id} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.dashboardSection}>
                    <Text style={styles.dashboardText   }>Vos quiz publié</Text>
                    <ScrollView>
                        {publishedQuizzes.map((item, index) => (
                            <View key={index}>
                                <CreatedQuizInformation quizId={item.id} category={item.category} difficulty={item.difficulty} date={item.createdAt} status={item.public} title={item.title} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <Button title="Se déconnecter" onPress={handleLogout} />
        </View>
    );
}
