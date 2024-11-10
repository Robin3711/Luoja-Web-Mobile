import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './components/Home';
import Parameters from './components/Parameters';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  return (
    <DrawerScreen.Navigator screenOptions={{ drawerPosition: 'left', headerShown: false  }}>
      <DrawerScreen.Screen name="Home" component={Home} />
      <DrawerScreen.Screen name="Créer un nouveau quiz" component={Parameters} />
    </DrawerScreen.Navigator>
  );
};


export default function App() {
  return (
    <NavigationContainer>
      <DrawerScreen />
    </NavigationContainer>
  );
}

