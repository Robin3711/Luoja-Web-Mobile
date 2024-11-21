import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();

export default function DifficultyRadioSelector({ value, onValueChange }) {

    const difficulties = [
        { label: 'Facile', value: 'easy' },
        { label: 'Moyen', value: 'medium' },
        { label: 'Difficile', value: 'hard' },
    ];

    return (
        <View style={styles.difficultyRadioSelectorView}>
            {difficulties.map((difficulty) => (
                <TouchableOpacity
                    key={difficulty.value}
                    style={[
                        styles.difficultyRadioSelectorButton,
                        value === difficulty.value && styles.selectedDifficultyRadioSelectorButton,
                    ]}
                    onPress={() => onValueChange(difficulty.value)}
                >
                    <Text
                        style={[
                            styles.difficultyRadioSelectorButtonText,
                            value === difficulty.value && styles.selectedDifficultyRadioSelectorButtonText,
                        ]}
                    >
                        {difficulty.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}