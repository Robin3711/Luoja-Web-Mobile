import { Text, View, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getPlatformStyle } from '../utils/utils';
import ThemeSelector from '../components/ThemePicker';
import RangeCursor from '../components/Cursor';
import DifficultySelector from '../components/DifficultyPicker';

styles = getPlatformStyle();

export default function SearchScreen() {
    const [data, setData] = useState([]);
    const [theme, setTheme] = useState('none');
    const [difficulty, setDifficulty] = useState('none');
    const [title, setTitle] = useState('');
    const [questionCount, setQuestionCount] = useState(1);

    const getQuizAutoComplete = async() => {
        try {
            const parameters ='';
            if (title !== '') {
                parameters += 'title=' + title;
            }
            if (theme !== 'none') {
                parameters += '&category=' + theme;
            }
            if (difficulty !== 'none') {
                parameters += '&difficulty=' + difficulty;
            }
            // if (questionCount !== 1) {
            //     parameters += '&questionCount=' + questionCount;
            // }
            const response = await fetch('https://api.luoja.fr/quiz/list?' + parameters);
            const json = await response.json();
            setData(json);
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
        <View style={styles.searchQuizView}>
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