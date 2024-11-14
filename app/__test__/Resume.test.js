import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Resume from '../src/screens/ResumeScreen';
import { NavigationContainer } from '@react-navigation/native';

describe('Resume Component', () => {
    const setup = () => {
        return render(
        <NavigationContainer>
            <Resume />
        </NavigationContainer>
        );
    };

    it('renders initial elements correctly', () => {
        const { getByText } = setup();
        expect(getByText('Reprenez votre partie')).toBeTruthy();
        expect(getByText('Reprendre')).toBeTruthy();
    });

    it('updates gameId when TextInput is changed', () => {
        const { getByPlaceholderText } = setup();
        const textInput = getByPlaceholderText('Identifiant de votre partie');
        
        fireEvent.changeText(textInput, '12345');
        
        expect(textInput.props.value).toBe('12345');
    });

    
  
});