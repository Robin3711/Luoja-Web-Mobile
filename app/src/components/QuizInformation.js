import React from 'react';
import { Button, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPlatformStyle } from '../utils/utils';
import { createParty } from '../utils/api';

const styles = getPlatformStyle();



export default function QuizInformation({quiz}) {
    navigation = useNavigation();
    const handleStartQuiz = () => {
        createParty(quiz.id).then((party) => {
            navigation.navigate('quizScreen', {quizId: party.id});
        });
    }
    return (
        <View style={styles.QuizInformationView}>
            <Text style={styles.QuizInformationText}>{quiz.title}</Text>
            <Text style={styles.QuizInformationText}>{quiz.category}</Text>
            <Text style={styles.QuizInformationText}>{quiz.difficulty}</Text>
            {/*<Text style={styles.QuizInformationText}>{quiz.questionCount}</Text>*/}
            <Button title="Jouer" onPress={handleStartQuiz}/>
        </View>
    );
}