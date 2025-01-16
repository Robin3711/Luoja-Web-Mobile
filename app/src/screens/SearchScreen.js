import { useEffect, useState, useCallback } from 'react';
import { Text, View, Platform, Dimensions, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';

import { getQuizAutoComplete } from '../utils/api';
import ThemeSelector from '../components/ThemeList';
import ChoiseSelector from '../components/ChoicePicker';
import QuizInformation from '../components/QuizInformation';
import { requireToken } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;
import GradientBackground from '../css/utils/linearGradient';

export default function SearchScreen() {
    const [data, setData] = useState([]);
    const [theme, setTheme] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    const [title, setTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);
    const [timer, setTimer] = useState(null);

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            requireToken(navigation);
            const fetchData = async () => {
                try {
                    const result = await getQuizAutoComplete(title, theme, difficulty);
                    setData(result);
                } catch (err) {
                    setError(true);
                    setErrorMessage(err.status + " " + err.message);
                }
            }
            fetchData();
        }, [title, theme, difficulty])
    );

    useEffect(() => {
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timer]);

    const handleSearchTitle = (currentTitle) => {
        if (timer) {
            clearTimeout(timer);
        }

        const newTimer = setTimeout(() => {
            setTitle(currentTitle);
        }, 500);

        setTimer(newTimer);
    }

    return (
        <GradientBackground>
            {error ? (
                <View style={styles.screen}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('initMenu', { screen: 'account' })
                    }}>
                        <Text style={styles.buttonText}>Retour au menu</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.screen}>
                    <Text style={[FONT.title, { marginTop: !isMobile ? 20 : -20 }]}>Quiz de la communauté !</Text>
                    <View style={styles.screen2}>
                        <View style={styles.searchParameterView}>
                            <Text style={[FONT.subTitle, { marginTop: -10, marginBottom: !isMobile ? 15 : 5 }]}>Filtrer les recherches</Text>
                            <View style={styles.filterView}>
                                <Text style={FONT.text}>Titre</Text>
                                <View style={styles.quizTitleView}>
                                    <TextInput style={styles.quizTitleText} placeholder='Titre' onChangeText={(value) => handleSearchTitle(value)} />
                                </View>
                            </View>
                            <View style={styles.filterView}>
                                <Text style={FONT.text}>Thème</Text>
                                <ThemeSelector onValueChange={setTheme} />
                            </View>
                            <View style={styles.filterView}>
                                <Text style={FONT.text}>Difficulté</Text>
                                <ChoiseSelector testID="ChoiseSelector" value={difficulty} onValueChange={setDifficulty} />
                            </View>
                        </View>

                        <View style={styles.quizCreationRightView}>
                            {!isMobile && <Text style={styles.quizCreationQuestionsTitle}>Liste des quiz :</Text>}
                            <ScrollView style={styles.questionsView}>
                                {data.length !== 0 ? (
                                    [...data].reverse().map((quiz, index) => (
                                        <View key={index} style={[styles.questionItem, index % 2 === 0 && styles.alternateBackground]}>
                                            <QuizInformation quiz={quiz} />
                                        </View>
                                    ))
                                ) : (
                                    <Text>Aucun quiz</Text>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            )}
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 20,
    },
    screen2: {
        flexDirection: !isMobile ? 'row' : 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '90%',
        height: '80%',
        marginTop: !isMobile ? 20 : 0,
    },
    filterView: {
        marginBottom: !isMobile ? 20 : 10,
    },
    searchParameterView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: !isMobile ? '60%' : 'auto',
        borderRadius: 20,
        padding: !isMobile ? 20 : 10,
        marginBottom: 10,
        paddingBottom: 0,
        width: !isMobile ? '40%' : '100%',
        borderColor: COLORS.palette.blue.normal,
        borderWidth: !isMobile ? 0 : 3,
    },
    quizCreationRightView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#8fd3ff',
        height: !isMobile ? '80%' : '55%',
        borderRadius: 20,
        padding: 20,
        width: !isMobile ? '50%' : '100%',
        borderRadius: 20,
        ...!isMobile && { marginLeft: 20 },
    },
    quizCreationQuestionsTitle: {
        fontFamily: 'LobsterTwo_400Regular',
        fontSize: 20,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
        marginBottom: 20,
    },
    quizTitleText: {
        padding: 5,
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
    },
    quizTitleView: {
        backgroundColor: '#58bdfe',
        width: '100%',
        padding: 10,
        borderRadius: 20,
    },
    questionsView: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
        height: '80%',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    questionItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderRadius: 20,
        marginVertical: 5,

    },
    alternateBackground: {
        backgroundColor: COLORS.palette.blue.lighter,
    },
});