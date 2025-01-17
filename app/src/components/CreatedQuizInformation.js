import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { getQuizAverage } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import { toast } from '../utils/utils';
import { COLORS } from '../css/utils/color';
import SimpleButton from './SimpleButton';
import { FONT } from '../css/utils/font';

const { width, height } = Dimensions.get('window');
const isMobile = width < height

export default function CreatedQuizInformation({ quizId, category, difficulty, date, status, title, nbQuestions, setDisable, disable }) {
    const [loading, setLoading] = useState(true);
    const [average, setAverage] = useState("aucune donnée");
    const [nbPlayed, setNbPlayed] = useState(0);
    const [nbQuestionsStr, setNbQuestions] = useState("any");

    const navigation = useNavigation();

    useEffect(() => {
        async function fetchParty() {
            setLoading(false);

            getQuizAverage(quizId).then((data) => {
                if (data.score === null) {
                    data.score = "aucune donnée";
                } else {
                    setAverage(Math.trunc(data.score) + "%");
                }
                setNbPlayed(data.nombreDePartie);
            }).catch((error) => {
                if (error.status && error.message) {
                    toast('error', error.status, error.message, 3000, COLORS.toast.text.red);
                } else {
                    toast('error', 'Erreur', error, 3000, COLORS.toast.text.red);
                }
            });

            setNbQuestions(nbQuestions);
        }
        fetchParty();
    }, [category, status, quizId, date, nbQuestions]);

    if (loading) {
        return <Text style={FONT.button}>Chargement...</Text>;
    }

    const isDraft = status === false;

    const detailTextStyle = [
        styles.detailText,
        isDraft && styles.draftText,
    ];

    const handleCreationQuiz = () => {
        if (status === false && !isMobile) {
            navigation.navigate('quizCreation', { quizId: quizId });
        }
    };

    const handlePlayQuiz = async () => {
        try {
            setDisable(true);
            navigation.navigate('launchGameMode', { quizId: quizId });
        } catch (error) {
            if (error.status && error.message) {
                toast("error", error.status, error.message, 1500, COLORS.toast.text.red);
            } else {
                toast('error', 'Erreur', error, 1500, COLORS.toast.text.red);
            }
            setDisable(false);
        } finally {
            setDisable(false);
        }
    };

    return (
        <View>
            {!isMobile || (isMobile && status) ? (
                <View style={styles.QuizInformationView}>
                    <View style={styles.PrincipalInformationsView}>
                        <Text style={[styles.titleText, isDraft && styles.draftText]}>{title}</Text>
                        <Text style={[styles.titleText, isDraft && styles.draftText]}>{difficulty}</Text>
                        <Text style={[styles.titleText, isDraft && styles.draftText]}>{nbQuestionsStr}</Text>
                        <SimpleButton
                            text={status ? "Jouer" : "Modifier"}
                            onPress={status ? handlePlayQuiz : handleCreationQuiz}
                            backgroundColor={status ? COLORS.button.blue.darkBasic : COLORS.button.blue.basic}
                            height={30}
                            width={100}
                            textStyle={{ fontSize: 20 }}
                            disabled={disable}
                        />
                    </View>
                    <View style={styles.SecondaryInformationsView}>
                        <Text style={detailTextStyle}>{isDraft ? "Brouillon" : `Joué ${nbPlayed} fois`}</Text>
                        <Text style={detailTextStyle}>{isDraft ? "" : `Réussite moyenne : ${average}`}</Text>
                    </View>
                </View>
            ) : (
                <View>

                </View>
            )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    QuizInformationView: {
        marginBottom: 8, // Espacement entre les éléments
        padding: 12, // Espacement interne
        borderRadius: 8, // Coins arrondis
        borderColor: '#cccccc', // Bordure légère
        borderWidth: 1,
        shadowColor: '#000', // Ombre légère
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Ombre sur Android
        backgroundColor: 'white',
    },
    PrincipalInformationsView: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8, // Espacement entre les éléments
        justifyContent: 'space-between',
    },
    SecondaryInformationsView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4, // Espace sous le titre
        width: '15%',
    },
    detailText: {
        fontSize: 12,
        color: '#666666', // Texte secondaire plus clair
        width: '40%',
    },
    draftQuiz: {
        borderColor: '#aaaaaa', // Bordure grise
        backgroundColor: '#f5f5f5', // Fond grisé
    },
    draftText: {
        color: '#aaaaaa', // Texte grisé
    },
    touchableOpacity: {
        padding: 8, // Espacement interne
        borderRadius: 4, // Coins arrondis
        width: 100, // Largeur fixe
        justifyContent: 'center', // Centrer le texte
        alignItems: 'center', // Centrer le texte
        height: 30, // Hauteur fixe
    }
});