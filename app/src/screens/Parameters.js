import { useState } from 'react';
import { Text, View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createQuiz } from '../utils/api';
import RangeCursor from '../components/Cursor';
import ThemeSelector from '../components/ThemeList'
import DifficultySelector from '../components/DifficultyPicker';

const platform = Platform.OS;

export default function Parameters() {
  const [difficulty, setDifficulty] = useState(null);
  const [theme, setTheme] = useState('none');
  const [questionCount, setQuestionCount] = useState(1);
  const [tempQuestionCount, setTempQuestionCount] = useState(1);
  const [lunch, setlunch] = useState(false);
  const navigation = useNavigation();

  const handleCreateQuiz = () => {
    setlunch(true);
    createQuiz(questionCount, theme, difficulty)
      .then(data => {
        navigation.navigate('menuDrawer');
        setlunch(false);
        setTimeout(() => {
          navigation.navigate('quizScreen', { gameId: data.id });
        }, 0);
      })
      .catch(error => {
        console.error(error);
      });
  };


  return (
    <View style={styles.quickQuizView}>
      <Text>Choisissez le nombre de question</Text>
      <RangeCursor testID="range-cursor" value={tempQuestionCount}
        onValueChange={setTempQuestionCount}
        onSlidingComplete={(value) => setQuestionCount(value)} />
      <ThemeSelector onValueChange={setTheme} />
      <DifficultySelector testID="difficulty-picker" value={difficulty} onValueChange={setDifficulty} />
      <TouchableOpacity  r     onPress={handleCreateQuiz} disabled={lunch}>
        {lunch ? (<Text>Création du quiz...</Text>) : (<Text>Créer le quiz</Text>)}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quickQuizView: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#4d65b4',
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});