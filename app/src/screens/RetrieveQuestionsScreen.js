import { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { getQuestions } from '../utils/api';
import ThemeSelector from '../components/ThemeList';
import DifficultyPicker from '../components/DifficultyPicker';
import RangeCursor from '../components/Cursor';
import { toast } from '../utils/utils';

export default function RetrieveQuestions() {
    const route = useRoute();
    const { handleAddQuestions } = route.params;

    const navigation = useNavigation();

    const [amount, setAmount] = useState(1);
    const [category, setCategory] = useState(9);
    const [difficulty, setDifficulty] = useState('easy');

    const handleRetrieveQuestions = async () => {
        try {
            const questions = await getQuestions(amount, category, difficulty);
            handleAddQuestions(questions);
            navigation.goBack();
        } catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000);
            } else {
                toast('error', "Erreur", error, 3000);
            }
        }
    }

    return (
        <View>
            <Toast ref={(ref) => Toast.setRef(ref)} />
            <ThemeSelector onValueChange={setCategory} />
            <DifficultyPicker value={difficulty} onValueChange={setDifficulty} />
            <RangeCursor value={amount} onValueChange={setAmount} />
            <TouchableOpacity onPress={handleRetrieveQuestions}>
                <Text>Valider</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
});