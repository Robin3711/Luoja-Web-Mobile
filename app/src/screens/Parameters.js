import { useState } from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createQuiz } from '../utils/api';
import { toast } from '../utils/utils';
import RangeCursor from '../components/Cursor';
import ThemeSelector from '../components/ThemeList'
import DifficultySelector from '../components/DifficultyPicker';
import SimpleButton from '../components/SimpleButton';

import { COLORS } from '../css/utils/color';

const platform = Platform.OS;

export default function Parameters() {
  const [difficulty, setDifficulty] = useState(null);
  const [theme, setTheme] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
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
          toast('error', error.status, error.message, 3000, 'crimson');
        } else {
          toast('error', "Erreur", error, 3000, 'crimson');
        }
      });
  };


  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Générer un nouveau quiz !</Text>

      <View style={styles.list}>
        <View style={{width:'100%'}}>
          <ThemeSelector onValueChange={setTheme} />
        </View>
        <DifficultySelector testID="difficulty-picker" value={difficulty} onValueChange={setDifficulty} />

        <View style={{ width: '100%' }}>
          <RangeCursor
            value={questionCount}
            onValueChange={setQuestionCount}
          />
        </View>

        <SimpleButton style={styles.buttons} text={launch ? (<Text>Création du quiz...</Text>) : (<Text>Créer le quiz</Text>)} disabled={launch} onPress={handleCreateQuiz} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.blue,
  },
  title: {
    textAlign: 'center',
    color: COLORS.text.blue.dark,
    fontSize: 50,
    fontFamily: 'LobsterTwo_700Bold_Italic',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: platform === 'web' ? '50%' : '80%',
    margin: 10,
  },
});