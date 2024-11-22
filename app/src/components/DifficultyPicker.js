import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getPlatformStyle, difficultyOptions } from '../utils/utils';

const styles = getPlatformStyle();

const DifficultySelector = ({ testID, value, onValueChange }) => {

    return (
        <View style={styles.cursorContainer}>
            <Text style={styles.parametersText}>Toute difficulté</Text>
            <RNPickerSelect
                onValueChange={onValueChange}
                items={difficultyOptions}
                value={value}
                placeholder={{ label: 'Toute difficulté', value: null }}
                accessibilityLabel="Sélecteur de difficulté"
                testID={testID}
            />
        </View>
    );
};

export default DifficultySelector;
