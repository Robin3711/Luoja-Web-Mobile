import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getPlatformStyle, themeOptions } from '../utils/utils';

const styles = getPlatformStyle();

const ThemeSelector = ({ testID, value, onValueChange }) => {

    return (
        <View style={styles.cursorContainer}>
            <Text style={styles.parametersText}>Choisissez un thème</Text>
            <RNPickerSelect
                onValueChange={onValueChange}
                items={themeOptions}
                value={value}
                placeholder={{ label: 'Thème générale', value: null }}
                accessibilityLabel="Sélecteur de thème"
                testID={testID}
            />
        </View>
    );
};



export default ThemeSelector;
