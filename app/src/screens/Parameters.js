import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
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
  const navigation = useNavigation();

  const handleCreateQuiz = () => {
    createQuiz(questionCount, theme, difficulty)
      .then(data => {
        navigation.navigate('menuDrawer');

        setTimeout(() => {
          navigation.navigate('quizScreen', { quizId: data.quizId });
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
        <Text>Créer le quiz</Text>
      </TouchableOpacity>
    </View>
  );
}
