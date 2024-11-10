import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/HomeScreen';
import { getPlatformStyle } from './src/utils/utils';

const styles = getPlatformStyle();

const drawerNavigator = createDrawerNavigator();

const MenuDrawer = () => {
  return (
    <drawerNavigator.Navigator screenOptions={{ drawerPosition: 'left', headerShown: false }}>
      <drawerNavigator.Screen name="HomeScreen" component={HomeScreen} />
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