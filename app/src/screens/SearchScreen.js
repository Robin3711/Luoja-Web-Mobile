import { Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { getPlatformStyle } from '../utils/utils';
import ThemeSelector from '../components/ThemePicker';

styles = getPlatformStyle();

export default function SearchScreen() {
    const [theme, setTheme] = useState('none');
    return (
    <View style={styles.searchQuizView}>
        <View style={styles.filterView}>
            <Text style={styles.parametersText}>Titre</Text>
            <TextInput style={styles.filterInput} placeholder="Rechercher un quiz par titre" />
        </View>
        <View style={styles.filterView}>
            <ThemeSelector testID="themeSelector" value={theme} onValueChange={setTheme} />
        </View>
            
    </View>
  );
}