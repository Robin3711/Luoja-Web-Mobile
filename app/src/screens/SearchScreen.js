import { Text, View, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getPlatformStyle } from '../utils/utils';
import ThemeSelector from '../components/ThemeList';
import RangeCursor from '../components/Cursor';
import DifficultySelector from '../components/DifficultyPicker';
import QuizInformation from '../components/QuizInformation';
import { getQuizAutoComplete } from '../utils/api';

styles = getPlatformStyle();

export default function SearchScreen() {
    const [data, setData] = useState([]);
    const [theme, setTheme] = useState('none');
    const [difficulty, setDifficulty] = useState('none');
    const [title, setTitle] = useState('');
    const [questionCount, setQuestionCount] = useState(1);
    const [tempQuestionCount, setTempQuestionCount] = useState(1);

    useEffect(() => {
        (async () => {
            await setData(getQuizAutoComplete(title, theme, difficulty));
            console.log(data);
        })

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