import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getPlatformStyle } from './src/utils/utils';

import Parameters from './src/screens/Parameters';
import HomeScreen from './src/screens/HomeScreen';

const styles = getPlatformStyle();

const drawerNavigator = createDrawerNavigator();

const MenuDrawer = () => {
  return (
    <drawerNavigator.Navigator screenOptions={{ drawerPosition: 'left'}}>
      <drawerNavigator.Screen name="Accueil" component={HomeScreen} />
      <drawerNavigator.Screen name="Créer un nouveau quiz" component={Parameters} />
    </drawerNavigator.Navigator>
  );
};

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