import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { getPlatformStyle, difficultyOptions } from '../utils/utils';

const styles = getPlatformStyle();

const DifficultySelector = ({ testID, value, onValueChange }) => {
    const [selectedIndex, setSelectedIndex] = useState(
        difficultyOptions.findIndex(option => option.value === value) || 0
    );

    const buttons = difficultyOptions.map(option => option.label);

    const handleSelection = index => {
        setSelectedIndex(index);
        onValueChange(difficultyOptions[index].value);
    };

    return (
        <View style={styles.difContainer}>
            <Text style={styles.parametersText}>Sélectionnez la difficulté</Text>
            <ButtonGroup
                buttons={buttons}
                selectedIndex={selectedIndex}
                onPress={handleSelection}
                containerStyle={styles.difButtonGroupContainer}
                buttonStyle={styles.difButtonStyle}
                selectedButtonStyle={styles.difSelectedButtonStyle}
                textStyle={styles.difTextStyle}
                selectedTextStyle={styles.difSelectedTextStyle}
            />
        </View>
    );
};

export default DifficultySelector;
