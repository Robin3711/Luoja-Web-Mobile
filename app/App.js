import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'

import Parameters from './src/screens/Parameters';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResumeScreen from './src/screens/ResumeScreen';
import EndScreen from './src/screens/EndScreen';

import { Platform } from 'react-native';

// Configuration pour le deep linking
const linking = {
  config: {
    screens: {
      home: 'home',
      newQuiz: 'newQuiz',
      resumeQuiz: 'resumeQuiz',
      quizScreen: 'quiz',
      endScreen: 'endScreen',
      parameters: 'parameters',
      menuDrawer: 'menu',
    },
  },
};

const drawer = createDrawerNavigator();
const stack = createStackNavigator()

const MenuDrawer = () => {
  return (
    <drawer.Navigator screenOptions={{ drawerPosition: 'left' }}>
      <drawer.Screen name="home" component={HomeScreen} options={{ title: "Accueil" }} />
      <drawer.Screen name="newQuiz" component={Parameters} options={{ title: "Créer un nouveau QUIZ" }} />
      <drawer.Screen name="resumeQuiz" component={ResumeScreen} options={{ title: "Reprendre un QUIZ" }} />
    </drawer.Navigator>
  );
};

const MenuStack = () => {
  return (
    <stack.Navigator>
      <stack.Screen name="menuDrawer" component={MenuDrawer} options={{ headerShown: false }} />
      <stack.Group screenOptions={{ presentation: 'modal' }}>
        <stack.Screen name="quizScreen" component={QuizScreen} options={{ title: "Le quiz",  headerLeft: Platform.OS === 'web' ? () => null : undefined }} />
        <stack.Screen name="endScreen" component={EndScreen} options={{ title: "Résultat", headerLeft: Platform.OS === 'web' ? () => null : undefined }} />
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