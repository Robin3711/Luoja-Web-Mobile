import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'

import Parameters from './src/screens/Parameters';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResumeScreen from './src/screens/ResumeScreen';
import EndScreen from './src/screens/EndScreen';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import RetrieveQuestions from './src/screens/RetrieveQuestionsScreen';
import SearchScreen from './src/screens/SearchScreen';
import Account from './src/screens/Account';
import QuizCreation from './src/screens/QuizCreationScreen';
import CreateQuestionScreen from './src/screens/CreateQuestionScreen';

import '@expo/metro-runtime'


const linking = {
  prefixes: ['http://localhost:8081', 'https://luoja.fr'],
  config: {
    screens: {
      home: 'home',
      newQuiz: 'newQuiz',
      resumeQuiz: 'resumeQuiz',
      quizScreen: 'game',
      endScreen: 'endScreen',
      menuDrawer: 'menu',
      userInfos: 'userInfos',
      login: 'login',
      register: 'register',
      retrieveQuestions: {
        path: 'retrieveQuestions/:handleAddQuestions',
        stringify: {
          handleAddQuestions: (handleAddQuestions) => "",
        },
      },
      createQuestion: {
        path: 'createQuestion/:handleAddQuestions',
        stringify: {
          handleAddQuestions: (handleAddQuestions) => "",
        },
      },
      search: 'search',
    },
  },
};

const drawer = createDrawerNavigator();
const stack = createStackNavigator()

const MenuDrawer = () => {
  return (
    <drawer.Navigator screenOptions={{ drawerPosition: 'left' }} initialRouteName='home'>
      <drawer.Screen name="home" component={HomeScreen} options={{ title: "Accueil" }} />
      <drawer.Screen name="newQuiz" component={Parameters} options={{ title: "Créer un nouveau QUIZ" }} />
      <drawer.Screen name="resumeQuiz" component={ResumeScreen} options={{ title: "Reprendre un QUIZ" }} />
      <drawer.Screen name="search" component={SearchScreen} options={{ title: "Rechercher un QUIZ" }} />
      <drawer.Screen name="account" component={Account} options={{ title: "Mon compte" }} />
      {Platform.OS === 'web' ? <drawer.Screen name="quizCreation" component={QuizCreation} options={{ title: "Créer un quiz" }} /> : null}
    </drawer.Navigator>
  );
};

const MenuStack = () => {
  return (
    <stack.Navigator initialRouteName='menuDrawer'>
      <stack.Screen name="menuDrawer" component={MenuDrawer} options={{ headerShown: false }} />
      <stack.Group screenOptions={{ presentation: 'modal' }}>
        <stack.Screen name="quizScreen" component={QuizScreen} options={{ title: "Le quiz", headerLeft: Platform.OS === 'web' ? () => null : undefined }} />
        <stack.Screen name="endScreen" component={EndScreen} options={{ title: "Résultat", headerLeft: Platform.OS === 'web' ? () => null : undefined }} />
        <stack.Screen name="login" component={Login} options={{ title: "Se connecter"}} />
        <stack.Screen name="register" component={Register} options={{ title: "S'inscrire"}} />
        {Platform.OS === 'web' ? <stack.Screen name="retrieveQuestions" component={RetrieveQuestions} options={{ title: "Récupérer des questions" }} /> : null}
        {Platform.OS === 'web' ? <stack.Screen name="createQuestion" component={CreateQuestionScreen} options={{ title: "Créer une question" }} /> : null}
      </stack.Group>
    </stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <MenuStack />
    </NavigationContainer>
  );
}