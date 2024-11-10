import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import RangeCursor from './Cursor';
import { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';

export default function Parameters() {
    const [Themes, setThemes] = useState([]);
    const [difficulty, setDifficulty] = useState('none');
    

    const difficultyOptions = [
        { label: 'Facile', value: 'easy' },
        { label: 'Moyen', value: 'medium' },
        { label: 'Difficile', value: 'hard' },
    ];
    return (
        <View>
          <Text>Choisissez le nombre de question</Text>
          <RangeCursor />
          <Text>Choisissez un thème</Text>
          <Text>Choisissez le difficulté</Text>
          <RNPickerSelect
                onValueChange={(value) => setDifficulty(value)}
                items={difficultyOptions}
                value={difficulty}
            />
          <Button title="Créer le quiz" onPress={() => console.log('Créer le quiz')} />
          <StatusBar style="auto" />
        </View>
    );
    }
    