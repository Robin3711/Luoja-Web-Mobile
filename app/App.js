import React from 'react';
import { useFonts, LobsterTwo_400Regular, LobsterTwo_700Bold_Italic } from '@expo-google-fonts/dev';
import Toast from 'react-native-toast-message';
import GradientNavigator from './src/components/GradientNavigator';
import { toastConfig } from './src/utils/utils';

export default function App() {
  let [fontsLoaded] = useFonts({
    LobsterTwo_400Regular,
    LobsterTwo_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <GradientNavigator />
      <Toast config={toastConfig} />
    </>
  );
}