import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'

import Parameters from './src/screens/Parameters';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResumeScreen from './src/screens/ResumeScreen';

const drawerNavigator = createDrawerNavigator();
const stack = createStackNavigator()

const MenuDrawer = () => {
  return (
    <drawerNavigator.Navigator screenOptions={{ drawerPosition: 'left' }}>
      <drawerNavigator.Screen name="home" component={HomeScreen} options={{ title: "Accueil" }} />
      <drawerNavigator.Screen name="newQUIZ" component={Parameters} options={{ title: "Créer un nouveau QUIZ" }} />
      <drawerNavigator.Screen name="resumeQUIZ" component={ResumeScreen} options={{ title: "Reprendre un QUIZ" }} />
    </drawerNavigator.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="MenuDrawer" component={MenuDrawer} options={{ headerShown: false }} />
        <stack.Group screenOptions={{ presentation: 'modal' }}>
          <stack.Screen name="QuizStack" component={QuizScreen} options={{ title: "Le quiz", headerLeft: () => null, animation: true }} />
          <stack.Screen name="ResumeQuiz" component={EndScreen} options={{ title: "Résultat", headerLeft: () => null, animation: true }} />
        </stack.Group>
      </stack.Navigator>
    </NavigationContainer>
  );
}