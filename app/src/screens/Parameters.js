import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { createQuiz } from '../utils/api';
import RangeCursor from '../components/Cursor';
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

  const difficultyOptions = [
    { label: 'Facile', value: 'easy' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Difficile', value: 'hard' },
  ];

  const themeOptions = [
    { label: 'General Knowledge', value: 9 },
    { label: 'Entertainment: Books', value: 10 },
    { label: 'Entertainment: Film', value: 11 },
    { label: 'Entertainment: Music', value: 12 },
    { label: 'Entertainment: Musicals & Theatres', value: 13 },
    { label: 'Entertainment: Television', value: 14 },
    { label: 'Entertainment: Video Games', value: 15 },
    { label: 'Entertainment: Board Games', value: 16 },
    { label: 'Science & Nature', value: 17 },
    { label: 'Science: Computers', value: 18 },
    { label: 'Science: Mathematics', value: 19 },
    { label: 'Mythology', value: 20 },
    { label: 'Sports', value: 21 },
    { label: 'Geography', value: 22 },
    { label: 'History', value: 23 },
    { label: 'Politics', value: 24 },
    { label: 'Art', value: 25 },
    { label: 'Celebrities', value: 26 },
    { label: 'Animals', value: 27 },
    { label: 'Vehicles', value: 28 },
    { label: 'Entertainment: Comics', value: 29 },
    { label: 'Science: Gadgets', value: 30 },
    { label: 'Entertainment: Japanese Anime & Manga', value: 31 },
    { label: 'Entertainment: Cartoon & Animations', value: 32 },
  ]

  return (
    <View style={styles.parametersView}>
      <Text style={styles.parametersText}>Choisissez le nombre de question</Text>
      <RangeCursor testID="range-cursor" value={questionCount} onValueChange={setQuestionCount} />
      <Text style={styles.parametersText}>Choisissez un thème</Text>
      <RNPickerSelect
        onValueChange={(value) => setTheme(value)}
        items={themeOptions}
        value={theme}
        placeholder={{ label: 'Thème aléatoire', value: null }}
        accessibilityLabel="Sélecteur de thème"
      />
      <Text style={styles.parametersText}>Choisissez le difficulté</Text>
      <RNPickerSelect
        onValueChange={(value) => setDifficulty(value)}
        items={difficultyOptions}
        value={difficulty}
        placeholder={{ label: 'Difficulté aléatoire', value: null }}
        accessibilityLabel="Sélecteur de difficulté"
      />
      <TouchableOpacity style={styles.createQuizButton} onPress={handleCreateQuiz}>
        <Text>Créer le quiz</Text>
      </TouchableOpacity>
    </View>
  );
}
