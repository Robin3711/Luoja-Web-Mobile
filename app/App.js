import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Parameters from './src/screens/Parameters';
import HomeScreen from './src/screens/HomeScreen';

const drawerNavigator = createDrawerNavigator();

const MenuDrawer = () => {
  return (
    <drawerNavigator.Navigator screenOptions={{ drawerPosition: 'left'}}>
      <drawerNavigator.Screen name="home" component={HomeScreen} options={{title: "Accueil"}}/>
      <drawerNavigator.Screen name="newQUIZ" component={Parameters} options={{title: "Créer un nouveau QUIZ"}}/>
    </drawerNavigator.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <MenuDrawer />
    </NavigationContainer>
  );
}