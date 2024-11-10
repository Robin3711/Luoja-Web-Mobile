import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import RangeCursor from './Cursor';

export default function Parameters() {
    return (
        <View>
          <Text>Choisissez le nombre de question</Text>
          <RangeCursor />
          <Button title="Créer le quiz" onPress={() => console.log('Créer le quiz')} />
          <StatusBar style="auto" />
        </View>
    );
    }
    