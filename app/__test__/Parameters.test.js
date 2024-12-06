import { render, fireEvent } from '@testing-library/react-native';
import Parameters from '../src/screens/Parameters';
import { NavigationContainer } from '@react-navigation/native';

global.clearImmediate = global.clearImmediate || function(immediateID) {
    clearTimeout(immediateID);
};

jest.mock('../src/utils/api', () => ({
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
        expect(getByText('Toute difficulté')).toBeTruthy();
        expect(getByText('Créer le quiz')).toBeTruthy();
    });

    it('updates question count when RangeCursor is changed', () => {
        const { getByTestId, getByText } = setup();
        const rangeCursor = getByTestId('range-cursor');
    
        // Simuler le changement de valeur du curseur
        fireEvent(rangeCursor, 'valueChange', 10);
    
        // Vérifier que la nouvelle valeur est affichée correctement
        expect(getByText('Sélection : 10')).toBeTruthy();

        // Simuler le changement de valeur du curseur
        fireEvent(rangeCursor, 'valueChange', 20);

        // Vérifier que la nouvelle valeur est affichée correctement
        expect(getByText('Sélection : 20')).toBeTruthy();
    });
  
});
