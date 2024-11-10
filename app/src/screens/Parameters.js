import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import RangeCursor from '../components/Cursor';

export default function Parameters() {
    return (
        <View>
          <Text>Choisissez le nombre de question</Text>
          <RangeCursor />
          <StatusBar style="auto" />
        </View>
    );
    }
    