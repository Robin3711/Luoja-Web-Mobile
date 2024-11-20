import React from 'react';
import { Text, View } from 'react-native';

export default function QuizInformation({quiz}) {
    return (
        <View style={styles.QuizInformationView}>
            <Text style={styles.QuizInformationText}>{quiz.title}</Text>
            <Text style={styles.QuizInformationText}>{quiz.category}</Text>
            <Text style={styles.QuizInformationText}>{quiz.difficulty}</Text>
            {/*<Text style={styles.QuizInformationText}>{quiz.questionCount}</Text>*/}
        </View>
    );
}