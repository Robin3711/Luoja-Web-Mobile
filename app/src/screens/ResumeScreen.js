import { useState } from 'react';
import { Text, View, TextInput, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

import { getGameInfos } from '../utils/api';
import { toast } from '../utils/utils';
import { useNavigation } from '@react-navigation/native';
import { ClipboardPaste } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

import { COLORS } from '../css/utils/color';
import SimpleButton from '../components/SimpleButton';
import GradientBackground from '../css/utils/linearGradient';
import { FONT } from '../css/utils/font';

const { width, height } = Dimensions.get('window');
const isMobile = width < height

export default function ResumeScreen() {
    const [gameId, setGameId] = useState('');
    const [search, setSearch] = useState(false);
    const navigation = useNavigation();

    const handleResumeGame = () => {
        try {
            setSearch(true);
            if (!gameId) {
                toast('error', 'Erreur', 'Veuillez saisir un identifiant de partie', 3000, COLORS.toast.text.red);
                setSearch(false);
                return;
            }
            let infos = getGameInfos(gameId.toLowerCase());
            infos.then(data => {
                if (data.error) {
                    toast('error', 'Erreur', 'Aucune partie trouvée avec cet identifiant', 3000, COLORS.toast.red);
                    setSearch(false);
                    return;
                }
                else {
                    setSearch(false);
                    navigation.navigate('quizScreen', { gameId: gameId.toLowerCase() });
                }
            })
                .catch(error => {
                    if (error.status && error.message) {
                        toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
                    } else {
                        toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
                    }
                });
        }
        catch (error) {
            if (error.status && error.message) {
                toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
            } else {
                toast('error', "Erreur", error, 3000, COLORS.toast.text.red);
            }
        }
    }

    const handlePasteGameId = async () => {
        const idOfGame = await Clipboard.getStringAsync();
        setGameId(idOfGame);
    };

    return (
        <GradientBackground showLogo={true}>
            <View style={styles.container}>
                <Text style={FONT.title}>Reprenez votre partie</Text>
                <View style={styles.inputView}>
                    <TouchableOpacity onPress={handlePasteGameId}>
                        <ClipboardPaste size={30} color="black" />
                    </TouchableOpacity>
                    <TextInput placeholder="Identifiant de votre partie" onChangeText={setGameId} value={gameId} autoFocus style={styles.input} />
                </View>
                <SimpleButton text={!search ? "Reprendre" : "Chargement..."} onPress={handleResumeGame} />
            </View>
        </GradientBackground>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    inputView: {
        width: !isMobile ? '20%' : '90%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 40,
    },
    input: {
        padding: 10,
        fontSize: 20,
        fontFamily: 'LobsterTwo_700Bold_Italic',
        color: COLORS.text.blue.dark,
    },
});