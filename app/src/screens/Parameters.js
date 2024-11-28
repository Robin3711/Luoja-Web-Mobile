import { useState } from 'react';
import { Text, View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createQuiz } from '../utils/api';
import { toast } from '../utils/utils';
import Toast from 'react-native-toast-message';
import RangeCursor from '../components/Cursor';
import ThemeSelector from '../components/ThemeList'
import DifficultySelector from '../components/DifficultyPicker';

const platform = Platform.OS;

export default function Parameters() {
  const [difficulty, setDifficulty] = useState(null);
  const [theme, setTheme] = useState('none');
  const [questionCount, setQuestionCount] = useState(1);
  const [tempQuestionCount, setTempQuestionCount] = useState(1);
  const [launch, setlaunch] = useState(false);
  const navigation = useNavigation();

  const handleCreateQuiz = () => {
    setlaunch(true);
    createQuiz(questionCount, theme, difficulty)
      .then(data => {
        navigation.navigate('menuDrawer');
        setlaunch(false);
        setTimeout(() => {
          navigation.navigate('quizScreen', { gameId: data.id });
        }, 0);
      })
      .catch(error => {
        if (error.status && error.message) {
          toast('error', error.status, error.message, 3000);
        } else {
          toast('error', "Erreur", error, 3000);
        }
      });
  };


  return (
    <View style={styles.quickQuizView}>
      <Text>Générer un nouveau quiz !</Text>
      <Toast />
      <ThemeSelector onValueChange={setTheme} />

      <DifficultySelector testID="difficulty-picker" value={difficulty} onValueChange={setDifficulty} />

      <RangeCursor testID="range-cursor" value={tempQuestionCount}
        onValueChange={setTempQuestionCount}
        onSlidingComplete={(value) => setQuestionCount(value)} />


      <TouchableOpacity style={styles.buttons} onPress={handleCreateQuiz} disabled={launch}>
        {launch ? (<Text>Création du quiz...</Text>) : (<Text>Créer le quiz</Text>)}
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
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8fd3ff',
    height: 50,
    width: 250,
    borderRadius: 15,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});