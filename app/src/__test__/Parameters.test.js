import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Parameters from '../screens/Parameters';
import { NavigationContainer } from '@react-navigation/native';
import { createQuiz } from '../utils/api';

global.clearImmediate = global.clearImmediate || function(immediateID) {
    clearTimeout(immediateID);
};

jest.mock('../utils/api', () => ({
    createQuiz: jest.fn().mockResolvedValue({}),
}));

describe('Parameters Component', () => {
    const setup = () => {
        return render(
        <NavigationContainer>
            <Parameters />
        </NavigationContainer>
        );
    };

    it('renders initial elements correctly', () => {
        const { getByText } = setup();
        expect(getByText('Choisissez le nombre de question')).toBeTruthy();
        expect(getByText('Choisissez un thème')).toBeTruthy();
        expect(getByText('Choisissez le difficulté')).toBeTruthy();
        expect(getByText('Créer le quiz')).toBeTruthy();
    });

    it('updates question count when RangeCursor is changed', () => {
        const { getByTestId } = setup();
        const rangeCursor = getByTestId('range-cursor');
        
        fireEvent(rangeCursor, 'valueChange', 30);
        
        // Assuming we display question count somewhere or range cursor reflects value
        expect(rangeCursor.props.value).toBe(30);
    });
  
});
