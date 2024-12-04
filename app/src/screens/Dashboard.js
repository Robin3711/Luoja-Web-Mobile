import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { hasToken, removeToken, toast } from "../utils/utils";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { getUserGame, getCreatedQuiz } from "../utils/api";
import HistoryQuizInformation from "../components/HistoryQuizInformation";
import CreatedQuizInformation from "../components/CreatedQuizInformation";


export default function Dashboard() {
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);
    const [publishedQuizzes, setPublishedQuizzes] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);

    if (!hasToken()) {
        navigation.navigate('login');
    }

    const handleLogout = async () => {
        await removeToken();
        toast('success', "Déconnection réussi !", `Au revoir et à bientot :-(`, 3000, 'seagreen');
        navigation.navigate('login');
    }

    useEffect(() => {
        if (!hasToken()) {
            navigation.navigate('login');
        }
    }
        , []);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                try {
                    const games = await getUserGame();
                    const quizzes = await getCreatedQuiz();
                    setHistory(games.games);
                    setPublishedQuizzes(quizzes);
                } catch (err) {
                    setError(true);
                    setErrorMessage(err.status + " " + err.message);
                }
            }

            fetchData();
        }, [])
    );


    return (
        error ? (
            <View style={styles.quizScreenView}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('menuDrawer', { screen: 'account' })
                }
                }>
                    <Text style={styles.buttonText}>Retour au menu</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.dashboardView}>
                <Text style={styles.dashboardText}>Tableau de bord</Text>
                <View style={styles.dashboardContainer}>
                    <View style={styles.dashboardSection}>
                        <Text style={styles.dashboardText}>Historique</Text>
                        <ScrollView>
                            {history.map((item, index) => (
                                <View key={index}>
                                    <HistoryQuizInformation partyId={item.id} />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles.dashboardSection}>
                        <Text style={styles.dashboardText}>Vos quiz publiés</Text>
                        <ScrollView>
                            {publishedQuizzes.map((item, index) => (
                                <View key={index}>
                                    <CreatedQuizInformation quizId={item.id} category={item.category} difficulty={item.difficulty} date={item.createdAt} status={item.public} title={item.title} nbQuestions={item.numberOfQuestions} />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity style={styles.touchableOpacity} onPress={handleLogout}>
                    <Text>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        )
    );
}

const styles = StyleSheet.create({
    dashboardView: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    dashboardText: {
        fontSize: 24,
    },
    dashboardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dashboardSection: {
        width: '48%',
        maxHeight: 700,
    },
    touchableOpacity: {
        margin: 10,
        backgroundColor: 'red',
        padding: 10,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
});