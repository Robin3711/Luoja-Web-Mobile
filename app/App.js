import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './components/Home';
import Parameters from './components/Parameters';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator initialRouteName='Home' screenOptions={{ drawerPosition: 'left' }}>
      <Drawer.Screen name="Accueil" component={Home} />
      <Drawer.Screen name="Créer un nouveau quiz" component={Parameters} />
    </Drawer.Navigator>
  );
};


export default function App() {
  return (
    <NavigationContainer>
      <DrawerScreen />
    </NavigationContainer>
  );
}

