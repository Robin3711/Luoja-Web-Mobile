import { useEffect, useState, useCallback } from 'react';
import { Text, View, Platform, StyleSheet, ScrollView, TextInput } from 'react-native';

import { getQuizAutoComplete } from '../utils/api';
import ThemeSelector from '../components/ThemeList';
import DifficultySelector from '../components/DifficultyPicker';
import QuizInformation from '../components/QuizInformation';
import { loadFont, requireToken } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const platform = Platform.OS;

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
        }, [])
    );

    useEffect(() => {
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

    }, [title, theme, difficulty]);

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

    loadFont();
    return (
        error ? (
            <View style={styles.screen}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('menuDrawer', { screen: 'account' })
                }
                }>
                    <Text style={styles.buttonText}>Retour au menu</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.screen}>
                <Text style={[styles.title, { width: '100%' }]}>Quiz de la communauté !</Text>

                <View style={styles.searchParameterView}>


                    <View style={styles.filterView}>
                        <Text style={styles.text}>Titre</Text>
                        <View style={styles.quizTitleView}>
                            <TextInput style={styles.quizTitleText} placeholder='Titre' onChangeText={(value) => handleSearchTitle(value)} />
                        </View>
                    </View>
                    <View style={styles.filterView}>
                        <Text style={styles.text}>Thème</Text>
                        <ThemeSelector onValueChange={setTheme} />
                    </View>
                    <View style={styles.filterView}>
                        <Text style={styles.text}>Difficulté</Text>
                        <DifficultySelector testID="difficultySelector" value={difficulty} onValueChange={setDifficulty} />
                    </View>
                </View>

                <View style={styles.quizCreationRightView}>
                    <Text style={styles.quizCreationQuestionsTitle}>Liste des questions :</Text>
                    <ScrollView style={styles.questionsView}>
                        {
                            data.length !== 0 ?
                                data.map((quiz, index) => (
                                    <View key={index} style={styles.questionItem}>
                                        <QuizInformation quiz={quiz} />
                                    </View>
                                ))
                                : <Text>Aucune question</Text>
                        }
                    </ScrollView>
                </View>
            </View>
        )
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: platform === 'web' ? 'row' : 'column',
        backgroundColor: COLORS.background.blue,
    },
    title: {
        textAlign: 'center',
        color: COLORS.text.blue.dark,
        fontSize: 50,
        fontWeight: 'bold',
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    text: {
        fontSize: 20,
        color: COLORS.text.blue.dark,
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    filterView: {
        marginBottom: 20,
    },
    quizCreationRightView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#8fd3ff',
        height: '75%',
        borderRadius: 20,
        padding: 20,
        width: platform === 'web' ? '40%' : '100%',
        ...platform !== 'web' && { height: '40%' },
    },
    quizCreationQuestionsTitle: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
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
        height: '80%'
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
    },
});