import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import GradientBackground from '../css/utils/linearGradient';

import HomeScreen from '../screens/HomeScreen';
import Parameters from '../screens/Parameters';
import SearchScreen from '../screens/SearchScreen';
import JoinGame from '../screens/JoinRoom';
import ResumeScreen from '../screens/ResumeScreen';
import QuizCreation from '../screens/QuizCreationScreen';
import Account from '../screens/Account';
import QuizScreen from '../screens/QuizScreen';
import EndScreen from '../screens/EndScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import RetrieveQuestions from '../screens/RetrieveQuestionsScreen';
import CreateQuestionScreen from '../screens/CreateQuestionScreen';
import LaunchGameMode from '../screens/LaunchGameMode';
import Room from '../screens/Room';
import RoomQuizScreen from '../screens/RoomQuizScreen';
import RoomEndScreen from '../screens/RoomEndScreen';
import MenuTab from '../components/MenuTab';

import { Platform } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MenuDrawer = () => {
  return (
    <Drawer.Navigator screenOptions={{ drawerPosition: 'left' }} initialRouteName='home'>
      <Drawer.Screen name="home" component={HomeScreen} options={{ title: "Luoja", drawerLabel: "Accueil" }} />
      <Drawer.Screen name="newQuiz" component={Parameters} options={{ title: "Luoja", drawerLabel: "Partie rapide" }} />
      <Drawer.Screen name="search" component={SearchScreen} options={{ title: "Luoja", drawerLabel: "Quiz de la communauté" }} />
      <Drawer.Screen name="JoinGame" component={JoinGame} options={{ title: "Luoja", drawerLabel: "Rejoindre une partie" }} />
      <Drawer.Screen name="resumeQuiz" component={ResumeScreen} options={{ title: "Luoja", drawerLabel: "Reprendre une partie" }} />
      {Platform.OS === 'web' ? <Drawer.Screen name="quizCreation" component={QuizCreation} options={{ title: "Luoja", drawerLabel: "Créer votre propre quiz" }} /> : null}
      <Drawer.Screen name="account" component={Account} options={{ title: "Luoja", drawerLabel: "Votre compte" }} />
    </Drawer.Navigator>
  );
};

const MenuStack = () => {
  return (
    <Stack.Navigator initialRouteName='initMenu'>
      {Platform.OS === 'web' ? <Stack.Screen name="initMenu" component={MenuTab} options={{ headerShown: false }} /> : <Stack.Screen name="initMenu" component={MenuDrawer} options={{ headerShown: false }} />}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="quizScreen" component={QuizScreen} options={{ title: "Le quiz" }} />
        <Stack.Screen name="endScreen" component={EndScreen} options={{ title: "Résultat", headerLeft: Platform.OS === 'web' ? () => null : undefined }} />
        <Stack.Screen name="login" component={Login} options={{ title: "Se connecter" }} />
        <Stack.Screen name="register" component={Register} options={{ title: "S'inscrire" }} />
        {Platform.OS === 'web' ? <Stack.Screen name="retrieveQuestions" component={RetrieveQuestions} options={{ title: "Importer des questions" }} /> : null}
        {Platform.OS === 'web' ? <Stack.Screen name="createQuestion" component={CreateQuestionScreen} options={{ title: "Créer une question" }} /> : null}
        <Stack.Screen name="launchGameMode" component={LaunchGameMode} options={{ title: "Lancer un mode de jeu" }} />
        <Stack.Screen name="room" component={Room} options={{ title: "Partie multijoueur" }} />
        <Stack.Screen name="roomQuizScreen" component={RoomQuizScreen} options={{ title: "Quiz" }} />
        <Stack.Screen name="roomEndScreen" component={RoomEndScreen} options={{ title: "Fin de partie multijoueur" }} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const GradientNavigator = () => {
  return (
    <GradientBackground>
      <NavigationContainer>
        <MenuStack />
      </NavigationContainer>
    </GradientBackground>
  );
};

export default GradientNavigator;