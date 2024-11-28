import { useEffect, useState } from 'react';
import { Text, View, TextInput, ScrollView, StyleSheet } from 'react-native';

import { getQuizAutoComplete } from '../utils/api';
import ThemeSelector from '../components/ThemeList';
import RangeCursor from '../components/Cursor';
import DifficultySelector from '../components/DifficultyPicker';
import QuizInformation from '../components/QuizInformation';

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
            <View style={styles.searchQuizView}>
                <View style={styles.searchParameterView}>
                    <View style={styles.filterView}>
                        <Text style={styles.parametersText}>Titre</Text>
                        <TextInput style={styles.filterInput} placeholder="Rechercher un quiz par titre" value={title} onChangeText={setTitle} />
                    </View>
                    <View style={styles.filterView}>
                        <ThemeSelector onValueChange={setTheme} />
                    </View>
                    <View style={styles.filterView}>
                        <DifficultySelector testID="difficultySelector" value={difficulty} onValueChange={setDifficulty} />
                    </View>
                    <View style={styles.filterView}>
                        <Text style={styles.parametersText}>Nombre de questions</Text>
                        <RangeCursor testID="range-cursor" value={tempQuestionCount}
                            onValueChange={setTempQuestionCount}
                            onSlidingComplete={(value) => setQuestionCount(value)} />
                    </View>
                </View>
                <View style={styles.scrollView}>
                    <ScrollView>
                        {data.map(function (quiz, index) {
                            return (<>
                                <QuizInformation quiz={quiz} />
                            </>)
                        })}
                    </ScrollView>
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
});