import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { getQuestions } from '../utils/api';
import ThemeSelector from '../components/ThemeList';
import ChoicePicker from '../components/ChoicePicker';
import RangeCursor from '../components/Cursor';
import { toast } from '../utils/utils';

import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import GradientBackground from '../css/utils/linearGradient';
import { FONT } from '../css/utils/font';

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
                toast('error', error.status, error.message, 3000, COLORS.toast.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.red);
            }
        }
    }

    return (
        <GradientBackground>
            <View style={styles.screen}>
                <Text style={FONT.title}>Importer des questions</Text>
                <View style={styles.list}>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.text}>Thème</Text>
                        <ThemeSelector onValueChange={setCategory} />
                    </View>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.text}>Difficulté</Text>
                        <ChoicePicker value={difficulty} onValueChange={setDifficulty} />
                    </View>
                    <View style={{ width: '100%' }}>
                        <RangeCursor value={amount} onValueChange={setAmount} />
                    </View>
                    <SimpleButton text='Valider' onPress={handleRetrieveQuestions} />

                </View>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
        margin: 10,
        gap: 30,
    },
    button: {
        backgroundColor: '#8fd3ff',
        height: 50,
        width: 250,
        borderRadius: 15,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text.blue.dark,
        textAlign: 'center',
    },
    text: {
        fontSize: 20,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        marginTop: 5,
        color: COLORS.text.blue.dark,
    },
});