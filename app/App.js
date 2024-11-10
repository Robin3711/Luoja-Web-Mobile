import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'

import Parameters from './src/screens/Parameters';
import HomeScreen from './src/screens/HomeScreen';
import QuizzScreen from './src/screens/QuizzScreen';

const drawerNavigator = createDrawerNavigator();
const stack = createStackNavigator()

const MenuDrawer = () => {
  return (
    <drawerNavigator.Navigator screenOptions={{ drawerPosition: 'left' }}>
      <drawerNavigator.Screen name="home" component={HomeScreen} options={{ title: "Accueil" }} />
      <drawerNavigator.Screen name="newQUIZ" component={Parameters} options={{ title: "Créer un nouveau QUIZ" }} />
    </drawerNavigator.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="MenuDrawer" component={MenuDrawer} options={{ headerShown: false }} />
        <stack.Group screenOptions={{ presentation: 'modal' }}>
          <stack.Screen name="QuizzStack" component={QuizzScreen} options={{ title: "Le quizz", headerLeft: () => null }} />
        </stack.Group>
      </stack.Navigator>
    </NavigationContainer>
  );
}