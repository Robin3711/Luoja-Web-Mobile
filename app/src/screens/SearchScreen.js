import { Text, View, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getPlatformStyle } from '../utils/utils';
import ThemeSelector from '../components/ThemePicker';
import RangeCursor from '../components/Cursor';
import DifficultySelector from '../components/DifficultyPicker';
import QuizInformation from '../components/QuizInformation';

styles = getPlatformStyle();

export default function SearchScreen() {
    const [data, setData] = useState([]);
    const [theme, setTheme] = useState('none');
    const [difficulty, setDifficulty] = useState('none');
    const [title, setTitle] = useState('');
    const [questionCount, setQuestionCount] = useState(1);

    const getQuizAutoComplete = async() => {
        try {
            let parameters ='';
            if (title !== '') {
                parameters += (parameters ? '&' : '') + 'title=' + title;
            }
            if (theme !== 'none' || theme !== null) {
                parameters += (parameters ? '&' : '') + 'category=' + theme;
            }
            if (difficulty !== 'none' || theme !== null) {
                parameters += (parameters ? '&' : '') + 'difficulty=' + difficulty;
            }
            // if (questionCount !== 1) {
            //     parameters += '&questionCount=' + questionCount;
            // }
            const response = await fetch('https://api.luoja.fr/quiz/list?' + parameters);
            const json = await response.json();
            setData(json.quizs);
            console.log(json);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getQuizAutoComplete();
    }, [title, theme, difficulty, questionCount]);

    return (
    <View style={styles.searchQuizView}>
        <View style={styles.searchParameterView}>
            <View style={styles.filterView}>
                <Text style={styles.parametersText}>Titre</Text>
                <TextInput style={styles.filterInput} placeholder="Rechercher un quiz par titre" value={title} onChangeText={setTitle} />
            </View>
            <View style={styles.filterView}>
                <ThemeSelector testID="themeSelector" value={theme} onValueChange={setTheme} />
            </View>
            <View style={styles.filterView}>
                <DifficultySelector testID="difficultySelector" value={difficulty} onValueChange={setDifficulty} />
            </View>
            <View style={styles.filterView}>
                <Text style={styles.parametersText}>Nombre de questions</Text>
                <RangeCursor testID="range-cursor" value={questionCount} onValueChange={setQuestionCount} />
            </View>
        </View>
        <View style={styles.scrollView}>
            <ScrollView>
                {data.map(function(quiz, index){
                    return(<>
                    <QuizInformation quiz={quiz}/>
                    </>)
                })}
            </ScrollView>
        </View>
    </View>
  );
}