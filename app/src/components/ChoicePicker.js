import { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import { difficultyOptions } from '../utils/utils';

const { width, height } = Dimensions.get('window');
const isMobile = width < height;


const ChoiseSelector = ({ value, onValueChange, parameters = difficultyOptions, defaultValue = false, style = null }) => {
    const [selectedIndex, setSelectedIndex] = useState(defaultValue ? 0 : null);

    const handleSelection = index => {
        if (defaultValue) {

            setSelectedIndex(index);
            onValueChange(parameters[index].value);
        } else {

            if (index === selectedIndex) {
                setSelectedIndex(null);
                onValueChange(null);
            } else {
                setSelectedIndex(index);
                onValueChange(parameters[index].value);
            }
        }
    };

    useEffect(() => {
        if (value !== undefined) {
            const index = parameters.findIndex(option => option.value === value);
            setSelectedIndex(index >= 0 ? index : (defaultValue ? 0 : null));
        }
    }, [value, parameters, defaultValue]);

    return (
        <View style={[styles.container, style]}>
            {parameters.map((option, index) => (
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
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#4d65b4',
        borderColor: '#4d65b4',
        borderRadius: 20,
        padding: isMobile ? 3 : 10,
        marginVertical: 5,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        margin: 5,
        borderRadius: 20,
        minWidth: 87,
        backgroundColor: 'white',
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

export default ChoiseSelector;
