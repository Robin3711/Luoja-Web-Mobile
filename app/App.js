import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'
import { useFonts, LobsterTwo_400Regular, LobsterTwo_700Bold_Italic } from '@expo-google-fonts/dev';
import Toast from 'react-native-toast-message';

import { toastConfig } from './src/utils/utils';

import MenuTab from './src/components/MenuTab';

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
import LaunchGameMode from './src/screens/LaunchGameMode';
import Room from './src/screens/Room';
import RoomQuizScreen from './src/screens/RoomQuizScreen';
import RoomEndScreen from './src/screens/RoomEndScreen';
import JoinGame from './src/screens/JoinRoom';
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
      initMenu: 'menu',
      userInfos: 'userInfos',
      login: 'login',
      register: 'register',
      JoinGame: 'JoinGame',
      retrieveQuestions: {
        path: 'retrieveQuestions/:handleAddQuestions',
        stringify: {
          handleAddQuestions: (handleAddQuestions) => "",
        },
      },
      createQuestion: {
        path: 'createQuestion/:question/:index/:handleQuestion',
        stringify: {
          question: (question) => "",
          index: (index) => "",
          handleQuestion: (handleQuestion) => "",
        },
      },
      search: 'search',
      room: {
        path: 'room',
        parse: {
          roomId: (roomId) => roomId, // Parse the query parameter
        },
      },
    },
  },
};


const drawer = createDrawerNavigator();
const stack = createStackNavigator()


const MenuDrawer = () => {
  return (
    <drawer.Navigator screenOptions={{ drawerPosition: 'left' }} initialRouteName='home'>
      <drawer.Screen name="home" component={HomeScreen} options={{ title: "Luoja", drawerLabel: "Accueil" }} />
      <drawer.Screen name="newQuiz" component={Parameters} options={{ title: "Luoja", drawerLabel: "Partie rapide" }} />
      <drawer.Screen name="search" component={SearchScreen} options={{ title: "Luoja", drawerLabel: "Quiz de la communauté" }} />
      <drawer.Screen name="JoinGame" component={JoinGame} options={{ title: "Luoja", drawerLabel: "Rejoindre une partie" }} />
      <drawer.Screen name="resumeQuiz" component={ResumeScreen} options={{ title: "Luoja", drawerLabel: "Reprendre une partie" }} />
      {Platform.OS === 'web' ? <drawer.Screen name="quizCreation" component={QuizCreation} options={{ title: "Luoja", drawerLabel: "Créer votre propre quiz" }} /> : null}
      <drawer.Screen name="account" component={Account} options={{ title: "Luoja", drawerLabel: "Votre compte" }} />
    </drawer.Navigator>
  );
};

const MenuStack = () => {
  return (
    <stack.Navigator initialRouteName='initMenu'>
      {Platform.OS === 'web' ? <stack.Screen name="initMenu" component={MenuTab} options={{ headerShown: false }} /> : <stack.Screen name="initMenu" component={MenuDrawer} options={{ headerShown: false }} />}
      <stack.Group screenOptions={{ presentation: 'modal' }}>
        <stack.Screen name="quizScreen" component={QuizScreen} options={{ title: "Le quiz" }} />
        <stack.Screen name="endScreen" component={EndScreen} options={{ title: "Résultat", headerLeft: Platform.OS === 'web' ? () => null : undefined }} />
        <stack.Screen name="login" component={Login} options={{ title: "Se connecter" }} />
        <stack.Screen name="register" component={Register} options={{ title: "S'inscrire" }} />
        {Platform.OS === 'web' ? <stack.Screen name="retrieveQuestions" component={RetrieveQuestions} options={{ title: "Importer des questions" }} /> : null}
        {Platform.OS === 'web' ? <stack.Screen name="createQuestion" component={CreateQuestionScreen} options={{ title: "Créer une question" }} /> : null}
        <stack.Screen name="launchGameMode" component={LaunchGameMode} options={{ title: "Lancer un mode de jeu" }} />
        <stack.Screen name="room" component={Room} options={{ title: "Partie multijoueur" }} />
        <stack.Screen name="roomQuizScreen" component={RoomQuizScreen} options={{ title: "Quiz" }} />
        <stack.Screen name="roomEndScreen" component={RoomEndScreen} options={{ title: "Fin de partie multijoueur" }} />
      </stack.Group>
    </stack.Navigator>
  );
};


export default function App() {
  let [fontsLoaded] = useFonts({
    LobsterTwo_400Regular,
    LobsterTwo_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <NavigationContainer linking={linking}>
        <MenuStack />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}