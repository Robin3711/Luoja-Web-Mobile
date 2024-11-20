import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

const difficultyOptions = [
    { label: 'Facile', value: 'easy' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Difficile', value: 'hard' },
];

const DifficultySelector = ({ testID, value, onValueChange }) => {

    return (
        <View style={styles.cursorContainer}>
            <Text style={styles.parametersText}>Choisissez le difficulté</Text>
            <RNPickerSelect
                onValueChange={onValueChange}
                items={difficultyOptions}
                value={value}
                placeholder={{ label: 'Difficulté aléatoire', value: null }}
                accessibilityLabel="Sélecteur de difficulté"
                testID={testID}
            />
        </View>
    );
};



export default DifficultySelector;
