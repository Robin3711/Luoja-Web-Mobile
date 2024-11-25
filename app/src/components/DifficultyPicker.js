import { useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import { difficultyOptions } from '../utils/utils';

const platform = Platform.OS;

const DifficultySelector = ({ testID, value, onValueChange }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const buttons = difficultyOptions.map(option => option.label);

    const handleSelection = index => {
        if (index === selectedIndex) {
            setSelectedIndex(null);
            onValueChange(null);
        }
        else{
            setSelectedIndex(index);
            onValueChange(difficultyOptions[index].value);
        }
    };

    return (
        <View style={styles.difficultyPickerView}>
            <Text>Sélectionnez la difficulté</Text>
            <ButtonGroup
                buttons={buttons}
                selectedIndex={selectedIndex}
                onPress={handleSelection}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.button}
                selectedButtonStyle={styles.selectedButton}
                textStyle={styles.text}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    difficultyPickerView: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: platform === 'web' ? '50%' : '100%',
    },
    buttonContainer: {
        height: 60,
        width: '100%',
        borderRadius: 20,
        backgroundColor: '#4d65b4',
    },
    button: {
        margin: 10,
        borderRadius: 20,
        backgroundColor: '#eef8ff',
    },
    selectedButton: {
        color: 'white',
        backgroundColor: '#484a77'
    },
    textStyle: {
        textAlign: 'center',
    }
}
);

export default DifficultySelector;
