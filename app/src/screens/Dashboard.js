import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { hasToken, removeToken, toast } from "../utils/utils";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { getUserGame, getCreatedQuiz } from "../utils/api";
import HistoryQuizInformation from "../components/HistoryQuizInformation";
import CreatedQuizInformation from "../components/CreatedQuizInformation";
import { COLORS } from "../css/utils/color";

const platform = Platform.OS;

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
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.background.blue,
    },
    dashboardText: {
        fontSize: 24,
    },
    dashboardContainer: {
        display: 'flex',
        flexDirection: platform === 'web' ? 'row' : 'column',
        justifyContent: 'space-between',
    },
    dashboardSection: {
        width: platform === 'web' ? '48%' : '100%',
        maxHeight: 700,
    },
    touchableOpacity: {
        backgroundColor: 'red',
        padding: 10,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
});