import { useEffect, useState } from 'react';
import { Text, View, TextInput, ScrollView, StyleSheet } from 'react-native';

import { getQuizAutoComplete } from '../utils/api';
import ThemeSelector from '../components/ThemeList';
import RangeCursor from '../components/Cursor';
import DifficultySelector from '../components/DifficultyPicker';
import QuizInformation from '../components/QuizInformation';
import { loadFont } from '../utils/utils';
import { COLORS } from '../css/utils/color';

export default function SearchScreen() {
    const [data, setData] = useState([]);
    const [theme, setTheme] = useState('none');
    const [difficulty, setDifficulty] = useState(null);
    const [title, setTitle] = useState('');
    const [questionCount, setQuestionCount] = useState(1);
    const [tempQuestionCount, setTempQuestionCount] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getQuizAutoComplete(title, theme, difficulty, questionCount);
                setData(result);
            } catch (err) {
                setError(true);
                setErrorMessage(err.status + " " + err.message);
            }
        }

        fetchData();

    }, [title, theme, difficulty, questionCount]);

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
                <Text style={[styles.title, {width:'100%'}]}>Quiz de la communauté !</Text>

                <View style={styles.searchParameterView}>

                    <View style={styles.filterView}>
                        <Text style={styles.text}>Titre</Text>
                    </View>
                    <View style={styles.filterView}>
                        <ThemeSelector onValueChange={setTheme} />
                    </View>
                    <View style={styles.filterView}>
                        <Text style={styles.text}>Difficulté</Text>
                        <DifficultySelector testID="difficultySelector" value={difficulty} onValueChange={setDifficulty} />
                    </View>
                    <View style={styles.filterView}>
                        <Text style={styles.text}>Nombre de questions</Text>
                        <RangeCursor testID="range-cursor" value={tempQuestionCount}
                            onValueChange={setTempQuestionCount}
                            onSlidingComplete={(value) => setQuestionCount(value)} />
                    </View>
                </View>
  
                <View style={styles.quizCreationRightView}>
            <Text style={styles.quizCreationQuestionsTitle}>Liste des questions :</Text>
            <View style={styles.questionsView}>
                {
                    data.length !== 0 ?
                        data.map((quiz, index) => (
                            <View key={index} style={styles.questionItem}>
                                <QuizInformation quiz={quiz} />
                            </View>
                        ))
                        : <Text>Aucune question</Text>
                }
            </View>
        </View>
            </View>
        )
    );
}

const styles = StyleSheet.create({
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },

    screen: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        width: '40%',
    },
    quizCreationQuestionsTitle: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
    },
    questionsView: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
        height: '80%'
    },

    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    questionItem:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

});