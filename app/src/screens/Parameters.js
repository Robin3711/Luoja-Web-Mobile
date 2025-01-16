import { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createQuiz } from '../utils/api';
import { toast } from '../utils/utils';
import RangeCursor from '../components/Cursor';
import ThemeSelector from '../components/ThemeList';
import ChoiseSelector from '../components/ChoicePicker';
import SimpleButton from '../components/SimpleButton';

import { COLORS } from '../css/utils/color';
import { FONT } from '../css/utils/font';

import GradientBackground from '../css/utils/linearGradient';

const { width, height } = Dimensions.get('window');
const isMobile = width < height

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
        navigation.navigate('initMenu');
        setlaunch(false);
        setTimeout(() => {
          navigation.navigate('quizScreen', { gameId: data.id });
        }, 0);
      })
      .catch(error => {
        if (error.status && error.message) {
          toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
        } else {
          toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
        }
        setlaunch(false);
      });
  };

  return (
    <GradientBackground>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/LogoLuojaRepete.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.screen}>
        <Text style={FONT.title}>Générer un nouveau quiz !</Text>
        <View style={styles.list}>
          <View style={{ width: '100%' }}>
            <Text style={styles.text}>Thème</Text>
            <ThemeSelector onValueChange={setTheme} />
          </View>
          <View style={{ width: '100%' }}>
            <Text style={styles.text}>Difficulté</Text>
            <ChoiseSelector value={difficulty} onValueChange={setDifficulty} />
          </View>
          <View style={{ width: '100%' }}>
            <RangeCursor value={questionCount} onValueChange={setQuestionCount} />
          </View>
          <SimpleButton text={launch ? 'Création du quiz...' : 'Créer le quiz'} onPress={handleCreateQuiz} disabled={launch} />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: !isMobile ? '40%' : '85%',
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
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    tintColor: COLORS.palette.blue.light,
    opacity: 0.35,
  },
});