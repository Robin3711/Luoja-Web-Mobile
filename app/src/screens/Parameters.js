import { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createQuiz } from '../utils/api';
import { toast } from '../utils/utils';
import RangeCursor from '../components/Cursor';
import ThemeSelector from '../components/ThemeList';
import DifficultySelector from '../components/DifficultyPicker';
import SimpleButton from '../components/SimpleButton';

import { COLORS } from '../css/utils/color';

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
        <View style={{ width: '100%' }}>
          <Text style={styles.text}>Thème</Text>
          <ThemeSelector onValueChange={setTheme} />
        </View>
        <View style={{ width: '100%' }}>
          <Text style={styles.text}>Difficulté</Text>
          <DifficultySelector value={difficulty} onValueChange={setDifficulty} />
        </View>
        <View style={{ width: '100%' }}>
          <RangeCursor value={questionCount} onValueChange={setQuestionCount} />
        </View>
        <SimpleButton text={launch ? 'Création du quiz...' : 'Créer le quiz'} onPress={handleCreateQuiz} disabled={launch} />
       
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
    marginBottom: 80,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    margin: 10,
    gap: 30,
  },
  button: {
    backgroundColor: '#8fd3ff',
    height: 50,
    width: 250,
    borderRadius: 15,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.blue.dark,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'LobsterTwo_700Bold_Italic',
    marginTop: 5,
    color: COLORS.text.blue.dark,
  },
});