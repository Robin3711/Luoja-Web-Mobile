import { Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createQuiz } from '../utils/api';
import RangeCursor from '../components/Cursor';
import DifficultySelector from '../components/DifficultyPicker';
import ThemeSelector from '../components/ThemePicker';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function Parameters() {
  const [difficulty, setDifficulty] = useState('none');
  const [theme, setTheme] = useState('none');
  const [questionCount, setQuestionCount] = useState(1);
  const [lunch, setlunch] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setlunch(false)
  }, []);

  const handleCreateQuiz = () => {
    setlunch(true);
    createQuiz(questionCount, theme, difficulty)
      .then(data => {
        navigation.navigate('menuDrawer');

        setTimeout(() => {
          navigation.navigate('quizScreen', { quizId: data.id });
        }, 0);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.parametersView}>
      <Text style={styles.parametersText}>Choisissez le nombre de question</Text>
      <RangeCursor testID="range-cursor" value={questionCount} onValueChange={setQuestionCount} />
      <ThemeSelector testID="theme-picker" value={theme} onValueChange={setTheme} />
      <DifficultySelector testID="difficulty-picker" value={difficulty} onValueChange={setDifficulty} />
      <TouchableOpacity style={styles.createQuizButton} onPress={handleCreateQuiz}>
        {lunch ? (<Text>Création du quiz...</Text>) : (<Text>Créer le quiz</Text>)}
      </TouchableOpacity>
    </View>
  );
}
