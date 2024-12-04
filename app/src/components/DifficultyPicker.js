import { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';

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
        else {
            setSelectedIndex(index);
            onValueChange(difficultyOptions[index].value);
        }
    };

    useEffect(() => {
        if (value) {
            const index = difficultyOptions.findIndex(option => option.value === value);
            setSelectedIndex(index);
        }
    }
        , [value]);

    return (
        <View style={styles.container}>
            {difficultyOptions.map((option, index) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.button,
                        selectedIndex === index && styles.selectedButton,
                    ]}
                    onPress={() => handleSelection(index)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            selectedIndex === index && styles.selectedText,
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#4d65b4',
        borderRadius: 20,
        padding: 10,
        margin: 10,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#eef8ff',
    },
    selectedButton: {
        backgroundColor: '#484a77',
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
    },
    selectedText: {
        color: 'white',
    },
});

export default DifficultySelector;
