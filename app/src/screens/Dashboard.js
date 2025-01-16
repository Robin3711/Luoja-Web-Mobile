import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { hasToken, removeToken, toast } from "../utils/utils";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { getUserGame, getCreatedQuiz } from "../utils/api";
import HistoryQuizInformation from "../components/HistoryQuizInformation";
import CreatedQuizInformation from "../components/CreatedQuizInformation";
import { COLORS } from "../css/utils/color";
import { publishSortOptions, historySortOptions } from "../utils/utils";
import SimpleButton from "../components/SimpleButton";
import ChoiseSelector from "../components/ChoicePicker";
import { FONT } from "../css/utils/font";
import GradientBackground from '../css/utils/linearGradient';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;


export default function Dashboard() {
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);
    const [publishedQuizzes, setPublishedQuizzes] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);
    const [sortPublishedQuizzes, setSortPublishedQuizzes] = useState(null);
    const [historyStatus, setHistoryStatus] = useState({});
    const [historyTitle, setHistoryTitle] = useState({})
    const [sortHistory, setSortHistory] = useState(null);
    const [showFastQuizOnly, setShowFastQuizOnly] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const [disableInformation, setDisableInformation] = useState(false);

    if (!hasToken()) {
        navigation.navigate('login');
    }

    const handleLogout = async () => {
        await removeToken();
        toast('success', "Déconnexion réussie !", `Au revoir et à bientôt :-(`, 3000, COLORS.toast.text.green);
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

    const handleSortQuizzes = (quizzes, sortOrder) => {
        if (sortOrder === true) {
            return quizzes.filter(item => (item.public === true));
        } else if (sortOrder === false) {
            return quizzes.filter(item => (item.public === false));
        }
        return quizzes;
    };

    const handleStatusChange = (partyId, status, title) => {
        setHistoryStatus(prev => ({ ...prev, [partyId]: status }));
        setHistoryTitle(prev => ({ ...prev, [partyId]: title }));
    };

    const handleSortHistoryItems = (history, sortOrder) => {
        let sortedItems = [...history];

        if (showFastQuizOnly) {
            sortedItems = sortedItems.filter(item =>
                historyTitle[item.id] !== "Fast Quiz"
            );
        }

        if (sortOrder === true) {
            sortedItems = sortedItems.filter(item =>
                historyStatus[item.id] === 'Rejouer'
            );
        } else if (sortOrder === false) {
            sortedItems = sortedItems.filter(item =>
                historyStatus[item.id] === 'Continuer'
            );
        }

        return sortedItems;
    };

    return (
        <GradientBackground showLogo={true}>
            {
                error ? (
                    <View style={styles.dashboardView}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('initMenu', { screen: 'account' })
                        }
                        }>
                            <Text style={styles.buttonText}>Retour au menu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.dashboardView}>
                        <Text style={FONT.title}>Tableau de bord</Text>
                        <View style={styles.dashboardContainer}>
                            {isMobile && (
                                <TouchableOpacity
                                    style={styles.toggleButton}
                                    onPress={() => setShowHistory(!showHistory)}
                                >
                                    <Text style={styles.toggleButtonText}>
                                        {showHistory ? "Afficher vos quiz publiés" : "Afficher l'historique"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {(!isMobile || showHistory) && (
                                <View style={styles.dashboardSection}>
                                    <Text style={styles.dashboardText}>Historique</Text>
                                    <View>
                                        <ChoiseSelector value={sortHistory} onValueChange={setSortHistory} parameters={historySortOptions} defaultValue={true} />
                                        <TouchableOpacity
                                            style={[
                                                styles.filterButton,
                                                showFastQuizOnly && styles.activeFilterButton
                                            ]}
                                            onPress={() => setShowFastQuizOnly(!showFastQuizOnly)}
                                        >
                                            <Text style={styles.filterButtonText}>
                                                {showFastQuizOnly ? "Afficher Tout" : "Enlever les quizs rapides"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView>
                                        {handleSortHistoryItems([...history].reverse(), sortHistory).map((item, index) => (
                                            <View key={index}>
                                                <HistoryQuizInformation partyId={item.id} quizId={item.quizId} onStatusChange={handleStatusChange} />
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                            {(!isMobile || !showHistory) && (
                                <View style={styles.dashboardSection}>
                                    <Text style={styles.dashboardText}>Vos quiz publiés</Text>
                                    <View>
                                        <ChoiseSelector value={sortPublishedQuizzes} onValueChange={setSortPublishedQuizzes} parameters={publishSortOptions} defaultValue={true} />
                                    </View>
                                    <ScrollView>
                                        {handleSortQuizzes([...publishedQuizzes].reverse(), sortPublishedQuizzes).map((item, index) => (
                                            <View key={index}>
                                                <CreatedQuizInformation
                                                    quizId={item.id}
                                                    category={item.category}
                                                    difficulty={item.difficulty}
                                                    date={item.createdAt}
                                                    status={item.public}
                                                    title={item.title}
                                                    nbQuestions={item.numberOfQuestions}
                                                    setDisable={setDisableInformation}
                                                    disable={disableInformation}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                        <SimpleButton text="Déconnexion" onPress={handleLogout} color={'red'} />
                    </View>
                )
            }
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    dashboardView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Aligner les éléments en haut
        width: "100vw",
        height: '100%',
    },
    title: {
        fontSize: !isMobile ? 75 : 30, // Réduction de la taille sur mobile
        fontFamily: 'LobsterTwo_700Bold_Italic',
        textAlign: 'center',
        marginBottom: 10, // Espacement sous le titre
    },
    dashboardText: {
        marginTop: 10,
        fontSize: !isMobile ? 40 : 20, // Réduction de la taille sur mobile
        fontFamily: 'LobsterTwo_700Bold_Italic',
        textAlign: 'center',
    },
    dashboardContainer: {
        flex: 1, // Prendre tout l'espace disponible
        flexDirection: !isMobile ? 'row' : 'column',
        justifyContent: !isMobile ? 'space-between' : 'flex-start',
        width: '100%',
        height: '100%',
    },
    dashboardSection: {
        flex: 1, // Prendre tout l'espace disponible par section
        marginBottom: !isMobile ? 0 : 10, // Ajouter un espacement entre les sections sur mobile
        padding: 10,
        backgroundColor: COLORS.background.lightBlue, // Ajouter une couleur de fond pour délimiter chaque section
        borderRadius: 8, // Amélioration visuelle
        maxHeight: '100%', // Limiter la hauteur sur mobile
        minWidth: !isMobile ? null : '100%',
    },
    touchableOpacity: {
        backgroundColor: 'red',
        padding: 10,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 10, // Espacement sous les listes
    },
    errorText: {
        color: COLORS.text.red,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: COLORS.button.blue.basic,
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    activeFilterButton: {
        backgroundColor: COLORS.button.blue.darkBasic, // Active state
    },
    filterButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    toggleButton: {
        backgroundColor: COLORS.button.blue.basic,
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    toggleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});