import { useEffect, useState, useCallback } from 'react';
import { Text, View, Platform, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

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
                <Text style={styles.title}>Quiz de la communauté !</Text>
                <View style={styles.screen2}>
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
                    {platform === 'web' && <Text style={styles.quizCreationQuestionsTitle}>Liste des quizs :</Text>}
                    <ScrollView style={styles.questionsView}>
                        {
                            data.length !== 0 ?
                                data.map((quiz, index) => (
                                    <View key={index} style={styles.questionItem}>
                                        <QuizInformation quiz={quiz} />
                                    </View>
                                ))
                                : <Text>Aucun quiz</Text>
                        }
                    </ScrollView>
                </View>
            </View>
        </View>
    )
);}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: COLORS.background.blue,
        paddingTop: platform === 'web' ? 20 : 0,
    },
    screen2: {
        flexDirection: platform === 'web' ? 'row' : 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '90%',
        height: '80%',
        marginTop: platform === 'web' ? 20 : 0,
    },
    title: {
        textAlign: 'center',
        color: COLORS.text.blue.dark,
        fontSize: 50,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        width: '100%',
    },
    text: {
        fontSize: 20,
        color: COLORS.text.blue.dark,
        fontFamily: 'LobsterTwo_700Bold_Italic',
    },
    filterView: {
        marginBottom: platform === 'web' ? 20 : 0,
    },
    searchParameterView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: platform === 'web' ? '60%' : '40%',
        borderRadius: 20,
        padding: platform === 'web' ? 20 : 0,
        width: platform === 'web' ? '40%' : '100%',
    },
    quizCreationRightView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#8fd3ff',
        height: platform === 'web' ? '80%' : '65%',
        borderRadius: 20,
        padding: 20,
        width: platform === 'web' ? '50%' : '100%',
        ...platform === 'web' && { marginLeft: 20 },
    },
    quizCreationQuestionsTitle: {
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