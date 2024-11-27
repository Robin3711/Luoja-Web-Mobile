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

    useEffect(() => {
        const fetchData = async () => {
            const result = await getQuizAutoComplete(title, theme, difficulty, questionCount);
            setData(result);
        }

        fetchData();

    }, [title, theme, difficulty, questionCount]);

    return (
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
    );
}

const styles = StyleSheet.create({
});