import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/HomeScreen';
import { getPlatformStyle } from './src/utils/utils';
import Parameters from './src/screens/Parameters';

const styles = getPlatformStyle();

const Drawer = createDrawerNavigator();

const MenuDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName='Accueil' screenOptions={{ drawerPosition: 'left' }}>
      <Drawer.Screen name="Accueil" component={HomeScreen} />
      <Drawer.Screen name="Créer un nouveau quiz" component={Parameters} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationContainer>
          <MenuDrawer />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}